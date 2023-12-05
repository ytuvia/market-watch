import boto3
import PyPDF2
import os
import uuid
import tempfile
from pdf2image import convert_from_path

s3 = boto3.client('s3')

def read_pdf_file(bucket, key):
    localfile = download_file(bucket, key)
    content = read_file(localfile)
    return content

def crop_pdf(bucket, key, page_number, box):
    print(bucket, key, page_number, box)
    localfile = download_file(bucket, key)
    box_top = box.get('top')
    box_left = box.get('left')
    box_width = box.get('width')
    box_height = box.get('height')
    with tempfile.TemporaryDirectory() as path:
        images = convert_from_path(localfile, output_folder=path, single_file=True, first_page=page_number, last_page=page_number)
        temp_directory_path = path

    for i, image in enumerate(images):
        width = image.width
        height = image.height
        left = width * box_left
        top = height * box_top

        cropped_image = image.crop((left, top, left + (width*box_width), (top+(height*box_height))))
        png_location = f'/tmp/processed_image.png'
        
        key_folder_name = os.path.dirname(key)
        unique_id = uuid.uuid4()
        cropped_key = f'{key_folder_name}/gen/{unique_id}.png'
        cropped_image.save(png_location)
        upload_file(bucket, png_location, cropped_key)
        url = generate_url(bucket, cropped_key)
        return url

def download_file(bucket, key):
  filename = os.path.basename(key)
  tmp_file_path = f'/tmp/{filename}'
  s3.download_file(bucket, key, tmp_file_path)
  return tmp_file_path

def upload_file(bucket, localfile, key):
    print(localfile)
    print(key)
    s3.upload_file(localfile, bucket, key)
    return key

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

def generate_url(bucket, key):
    response = s3.generate_presigned_url('get_object', Params={'Bucket': bucket, 'Key': key})
    return response

#result = crop_pdf('market-watch150330-demo', 'public/41da6083-d949-45ba-b593-ebec09cc3f84/889c1958-cc65-40aa-bd59-d79f05884842.pdf', 1, {'top': 0.0016300925053656101, 'left': 0, 'width': 0.9982385039329529, 'height': 0.4873049557209015})
#print(result)