import ast  # for converting embeddings saved as strings back to arrays
import openai  # for calling the OpenAI API
import pandas as pd  # for storing text and embeddings data
import tiktoken  # for counting tokens
from scipy import spatial  # for calculating vector similarities for search
from lib.appsync import query_api
import psycopg2
from pgvector.psycopg2 import register_vector
import os
import numpy as np

# models
EMBEDDING_MODEL = "text-embedding-ada-002"
GPT_MODEL = "gpt-3.5-turbo"
MAX_TOKENS = 1000

openai.api_key = os.environ.get('OPENAPI_KEY')


def ask_entity(id, query):
    documents = get_entity_documents(id)
    documents_df = pd.DataFrame(documents)
    response = ask(query, documents_df, print_message=True)
    return response

def get_entity_documents(id):
    variables = {
        'id': id,
    }
    query = """
        query GetEntity($id: ID!) {
            getEntity(id: $id) {
                documents {
                    items {
                        id
                        content
                    }
                }
            }
        }
    """
    response = query_api(query, variables)
    print(variables)
    print(response)
    return response['data']['getEntity']['documents']['items']

def search_related_documents(ids, query):
    response = openai.Embedding.create(input=[query], model='text-embedding-ada-002')
    query_embedding = response['data'][0]['embedding'] 
    embedding_array = np.array(query_embedding)
    sqlquery = "SELECT * FROM documents WHERE id IN %s ORDER BY embedding <=> %s LIMIT 3"
    conn = psycopg2.connect(os.environ.get('PG_DSN'))
    register_vector(conn)
    cursor = conn.cursor()
    cursor.execute(sqlquery, (tuple(ids),embedding_array,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

def num_tokens(text: str, model: str = GPT_MODEL) -> int:
    """Return the number of tokens in a string."""
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))


def query_message(
    query: str,
    df: pd.DataFrame,
    model: str,
    token_budget: int
) -> str:
    """Return a message for GPT, with relevant source texts pulled from a dataframe."""
    
    ids = df['id'].values
    strings = search_related_documents(ids, query)
    
    introduction = 'Use the below documents on a business entity to answer the subsequent question. If the answer cannot be found in the documents, write "I could not find an answer."'
    question = f"\n\nQuestion: {query}"
    message = introduction
    for string in strings:
        next_article = f'\n\ndocument section:\n"""\n{string}\n"""'
        if (
            num_tokens(message + next_article + question, model=model)
            > token_budget
        ):
            break
        else:
            message += next_article
    return message + question

def ask(
    query: str,
    df: pd.DataFrame,
    model: str = GPT_MODEL,
    token_budget: int = 4096 - 500,
    print_message: bool = False,
) -> str:
    """Answers a query using GPT and a dataframe of relevant texts and embeddings."""
    message = query_message(query, df, model=model, token_budget=token_budget)
    if print_message:
        print(message)
    messages = [
        {"role": "system", "content": "You answer questions about the business entity."},
        {"role": "user", "content": message},
    ]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0
    )
    response_message = response["choices"][0]["message"]["content"]
    return response_message

