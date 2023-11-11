import boto3
import PyPDF2
import os

s3 = boto3.client('s3')

def read_pdf_file(bucket, key):
    localfile = download_file(bucket, key)
    content = read_file(localfile)
    return content

def download_file(bucket, key):
  filename = os.path.basename(key)
  tmp_file_path = f'/tmp/{filename}'
  s3.download_file(bucket, key, tmp_file_path)
  return tmp_file_path

def read_file(localfile):
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