from lib.appsync import query_api
import boto3
import nltk.data
from nltk.tokenize import word_tokenize
import os

nltk.data.path.append("/tmp/")
nltk.download('punkt', download_dir='/tmp/')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

region = os.environ["REGION"]

translate = boto3.session.Session().client(service_name="translate", region_name=region)
comprehend = boto3.client(service_name="comprehend", region_name=region)

def translate_document(id, source_lang, target_lang):
    document = get_document(id)
    language = detect_language(document['content'])
    if language != 'en':
        translation = translate_document_text(document['content'], source_lang, target_lang)
        update_document_content(id, translation)
    return id

def translate_document_text(text, source_lang, target_lang):
    result = []
    text_to_translate = ''
    sentences = tokenizer.tokenize(text)
    for sentence in sentences:
        
        if len(text_to_translate.encode('utf-16')) + len(sentence.encode('utf-16')) > 10000:
            words = word_tokenize(sentence)
            for word in words:
                if(len(text_to_translate.encode('utf-16')) + len(sentence.encode('utf-16')) > 10000):
                    if(len(text_to_translate) > 0):
                        #result.append(text_to_translate)
                        translation = translate.translate_text(Text=text_to_translate,SourceLanguageCode=source_lang,TargetLanguageCode=target_lang)
                        result.append(translation['TranslatedText'])
                        text_to_translate = ''
                else:
                    text_to_translate = text_to_translate + ' ' + word
        else:
            text_to_translate = text_to_translate +' '+ sentence

    #result.append(text_to_translate)
    translation = translate.translate_text(Text=text_to_translate,SourceLanguageCode=source_lang,TargetLanguageCode=target_lang)
    result.append(translation['TranslatedText'])
    print(result)
    return ' '.join(result)

def get_document(id):
    variables = {
        'id': id,
    }
    query = """
        query getDocument($id: ID!) {
            getDocument(id: $id) {
                id
                filename
                content
            }
        }
    """
    response = query_api(query, variables)
    return response['data']['getDocument']

def update_document_content(id, content):
    variables = {
        'input':{
            'id': id,
            'content': content
        }
    }
    print(variables)
    query = """
        mutation UpdateDocument($input: UpdateDocumentInput!) {
            updateDocument(input: $input) {
                id
            }
        }
    """
    response = query_api(query, variables)
    print(response)
    return response['data']['updateDocument']

def detect_language(text):
    # Call the detect_dominant_language function
    response = comprehend.detect_dominant_language(Text=text[:200])
    print(response)
    return response['Languages'][0]['LanguageCode']