from openai import OpenAI
from lib.appsync import query_api
import json
import os
import time
import boto3

s3 = boto3.client('s3')

GPT_MODEL="gpt-4-1106-preview"
client = OpenAI(
    api_key=os.environ.get('OPENAPI_KEY') 
)

def run_assistance(entity_id, message):
    (assistant, thread) = build_infrastructure(entity_id)
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=message,
    )
    show_json(message)

    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
    )
    show_json(run)
    run = wait_on_run(run, thread)
    show_json(run)

    messages = client.beta.threads.messages.list(thread_id=thread.id)
    show_json(messages)
    return messages

def build_infrastructure(entity_id):
    entity = get_entity(entity_id)
    saved_documents = entity['documents']['items']
    saved_assistant = entity['assistant']
    saved_threads = entity['threads']['items']

    if(saved_assistant):
        assistant = client.beta.assistants.retrieve(
            assistant_id=saved_assistant.get('id'),
        )
    else:
        assistant = client.beta.assistants.create(
            name=entity.get('name'),
            instructions="You are a personal assistant for a business analysis manager.",
            tools=[{"type": "retrieval"}],
            model=GPT_MODEL,
        )
        create_entity_assistant(entity, assistant)
        assistant = emmbed_assistant_documents(assistant, saved_documents)

    show_json(assistant)
    if(len(saved_threads)>0):
        saved_thread = saved_threads[0]
        thread = client.beta.threads.retrieve(
            thread_id=saved_thread.get('id')
        )
    else:
        thread = client.beta.threads.create()
        create_entity_thread(entity, thread)
    
    show_json(thread)

    return (assistant, thread)

def emmbed_assistant_documents(assistant, documents):
    file_ids = [obj['id'] for obj in documents]
    print(file_ids)
    assistant = client.beta.assistants.update(
        assistant.id,
        file_ids=file_ids,
    )
    show_json(assistant)
    return assistant

def download_file(key):
  filename = os.path.basename(key)
  tmp_file_path = f'/tmp/{filename}'
  s3.download_file(os.environ.get('STORAGE_CONTENT_BUCKETNAME'), key, tmp_file_path)
  return tmp_file_path

def get_entity(id):
    variables = {
        'id': id,
    }
    query = """
        query GetEntity($id: ID!) {
            getEntity(id: $id) {
                id
                name
                documents {
                    items{
                        id
                        filename
                    }
                }
                assistant {
                    id
                }
                threads {
                    items {
                        id
                    }
                }
            }
        }
    """
    response = query_api(query, variables)
    print(response)
    data = response['data']['getEntity']
    return data

def create_entity_assistant(entity, assistant):
    variables = {
        'input':{
            'id': assistant.id,
            'name': assistant.name
        }
    }
    query = """
        mutation createEntityAssistant($input: CreateEntityAssistantInput!) {
            createEntityAssistant(input: $input) {
                id
            }
        }
    """
    response = query_api(query, variables)

    variables = {
        'input':{
            'id': entity['id'],
            'entityAssistantId': assistant.id
        }
    }
    query = """
        mutation UpdateEntity($input: UpdateEntityInput!) {
            updateEntity(input: $input) {
                id
            }
        }
    """
    response = query_api(query, variables)
    return assistant

def create_entity_thread(entity, thread):
    variables = {
        'input':{
            'id': thread.id,
            'entityThreadsId': entity.get('id')
        }
    }
    query = """
        mutation createEntityThread($input: CreateEntityThreadInput!) {
            createEntityThread(input: $input) {
                id
            }
        }
    """
    response = query_api(query, variables)
    return thread

def update_document_file(id, openai_id):
    variables = {
        'input':{
            'id': id,
            'openaiFileId': openai_id
        }
    }
    query = """
        mutation UpdateDocument($input: updateDocumentInput!) {
            updateDocument(input: $input) {
                id
            }
        }
    """
    response = query_api(query, variables)
    return response['data']['updateDocument']

def show_json(obj):
    print(json.loads(obj.model_dump_json()))

def wait_on_run(run, thread):
    current = run.status
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        if current != run.status:
            current = run.status
            update_status(thread, current)
            print(current)
        time.sleep(0.5)
    return run

def update_status(thread, status):
    variables = {
        'input':{
            'id': thread.id,
            'status': status
        }
    }
    print(variables)
    query = """
        mutation UpdateEntityThread($input: UpdateEntityThreadInput!) {
            updateEntityThread
            (input: $input) {
                id
            }
        }
    """
    response = query_api(query, variables)
    print(response)
    return response['data']['updateEntityThread']

def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )

def create_thread_and_run(user_input):
    thread = client.beta.threads.create()
    run = submit_message(MATH_ASSISTANT_ID, thread, user_input)
    return thread, run

def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

#run_assistance('efdcbb44-ec37-4893-806e-819203270c0a', 'please summarize the file')