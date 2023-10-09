import boto3
import requests
import json
import os
import PyPDF2
from bs4 import BeautifulSoup
from lib.appsync import query_api

region = os.environ["REGION"]

s3 = boto3.client('s3')
comprehend = boto3.client(service_name="comprehend", region_name=region)
translate = boto3.session.Session().client(service_name="translate", region_name=region)

def handler(event, context):
  print('received event:')
  print(event)
  result = []
  for message in event['Records']:
    event_name = message['eventName']
    if event_name == 'ObjectCreated:Put' or event_name == 'ObjectCreated:CompleteMultipartUpload':
      object = message['s3']['object']
      bucket = message['s3']['bucket']
      file_info = get_file_metadata(bucket['name'], object['key'])
      filename = download_file(bucket['name'], object['key'])
      if file_info['ContentType'] == 'application/pdf':
        content = read_pdf(f'/tmp/{filename}')
      elif file_info['ContentType'] in ['image/png', 'image/jpeg', 'image/gif']:
         content = '' # at the moment we don't read image files
      elif file_info['ContentType'] in ['text/html']:
         with open(f'/tmp/{filename}', "r", errors='replace', encoding='utf-8') as f:
            content = remove_html_tags(f.read())
            print(content)
      else:
         with open(f'/tmp/{filename}', "r", errors='replace', encoding='utf-8') as f:
            content = f.read()
      folders = object['key'].split('/')[:-1]
      entityId = folders[len(folders) - 1]
      document = create_document(filename, content, entityId)
      language = detect_language(content)
      if language != 'en':
         post_document_translate(document["id"])
      post_embed_document(document["id"])
      result.append(document["id"])

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(result)
  }

def get_file_metadata(bucket, key):
    head_object_response = s3.head_object(Bucket=bucket, Key=key)
    return head_object_response

def download_file(bucket, key):
  filename = os.path.basename(key)
  tmp_file_path = f'/tmp/{filename}'
  s3.download_file(bucket, key, tmp_file_path)
  return filename

def read_pdf(localfile):
    # Open the PDF file in binary mode
    with open(localfile, 'rb') as file:
        # Create a PDF object
        pdf = PyPDF2.PdfReader(file)

        # Iterate over every page
        texts = []
        for page in pdf.pages:
            # Extract the text from the page
            text = page.extract_text()

            # Print the text
            texts.append(text)
    return ' '.join(texts)

def create_document(filename, content, entityId):
    variables = {
        'input': {
          'filename': filename,
          'content': content,
          'entityDocumentsId': entityId
        }
    }
    print(variables)
    query = """
        mutation createDocument($input: CreateDocumentInput!) {
            createDocument(input: $input){
                id
                filename
                content
           }
        }
    """
    response = query_api(query, variables)
    print(response)
    return response['data']['createDocument']

def detect_language(text):
    # Call the detect_dominant_language function
    response = comprehend.detect_dominant_language(Text=text[:200])
    print(response)
    return response['Languages'][0]['LanguageCode']

def remove_html_tags(text):
    soup = BeautifulSoup(text, 'html.parser')
    clean_text = soup.get_text()
    return clean_text

def post_document_translate(id):
    url = os.environ.get('RESTAPI_ENDPOINT', None) + "/translate"

    payload = json.dumps({
        "document_id": id,
        "source_lang": "he",
        "target_lang": "en"
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)
    return response.text

def post_embed_document(id):
    url = os.environ.get('RESTAPI_ENDPOINT', None) + "/embed/document"

    payload = json.dumps({
        "document_id": id
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)
    return response.text

