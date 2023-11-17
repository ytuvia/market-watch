from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from translate import translate_document
from question_agent import ask_entity
from lib.embedding import insert_row
from pdf_utils import read_pdf_file
from csv_utils import read_csv_file
from entity_assistant import run_assistance, get_entity_thread, get_entity_messages, delete_thread, delete_assistant, delete_entity_embedding

class S3KeyInput(BaseModel):
    bucket: str
    key: str

class AskInput(BaseModel):
    entity_id: str
    question: str

class ChatInput(BaseModel):
    entity_id: str
    message: str

class TranslateInput(BaseModel):
    document_id: str
    source_lang: str
    target_lang: str

class DocumentInput(BaseModel):
    document_id: str

class EntityInput(BaseModel):
    entity_id: str

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"market watch rest api"}

@app.post("/translate")
async def translate(input: TranslateInput):
    result = translate_document(input.document_id, input.source_lang, input.target_lang)
    return result

@app.post("/ask")
async def ask_question(input: AskInput):
    try:
        result = ask_entity(input.entity_id, input.question)
        return result
    except Exception as e:
        return(f"An error occurred: {e}")

@app.post("/chat")
async def chat(input: ChatInput):
    result = run_assistance(input.entity_id, input.message)
    return result

@app.post("/thread")
async def entity_thread(input: EntityInput):
    result = get_entity_thread(input.entity_id)
    return result

@app.post("/thread/messages")
async def entity_thread_messages(input: EntityInput):
    result = get_entity_messages(input.entity_id)
    return result

@app.post("/thread/delete")
async def entity_thread_delete(input: EntityInput):
    result = delete_thread(input.entity_id)
    return result

@app.post("/assistant/delete")
async def entity_assistant_delete(input: EntityInput):
    result = delete_assistant(input.entity_id)
    return result

@app.post("/embed/document")
async def embed_document(input: DocumentInput):
    result = insert_row(input.document_id)
    return result

@app.post("/entity/remove_embedding")
async def embedding_entity_delete(input: EntityInput):
    result = delete_entity_embedding(input.entity_id)
    return result

@app.post("/read_pdf")
async def read_pdf(input: S3KeyInput):
    result = read_pdf_file(input.bucket, input.key)
    return result

@app.post("/read_csv")
async def read_csv(input: S3KeyInput):
    result = read_csv_file(input.bucket, input.key)
    return result
