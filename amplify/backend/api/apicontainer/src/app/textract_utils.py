import boto3
import json
import os

s3 = boto3.client('s3')

def list_document_images(bucket, key):
    result = []
    localfile = download_file(bucket, key)
    with open(localfile, 'r') as file:
        data = json.load(file)

    blocks=data['Blocks']

    for block in blocks:
        # Display information about a block returned by text detection
        if block['BlockType'] == 'LAYOUT_FIGURE':
            bounding_box = block['Geometry']['BoundingBox']
            result.append({
                'id': block['Id'],
                'confidence': block['Confidence'],
                'page': block['Page'],
                'bounding_box': {
                    'top': bounding_box['Top'],
                    'left': bounding_box['Left'],
                    'width': bounding_box['Width'],
                    'height': bounding_box['Height']
                }
            })
    return result

def list_document_titles(bucket, key):
    result = []
    localfile = download_file(bucket, key)
    with open(localfile, 'r') as file:
        data = json.load(file)

    blocks=data['Blocks']   
    print ('Detected Document Text')

    for block in blocks:
        # Display information about a block returned by text detection
        if block['BlockType'] == 'LAYOUT_TITLE':
            bounding_box = block['Geometry']['BoundingBox']
            identified = {
                'id': block['Id'],
                'confidence': block['Confidence'],
                'page': block['Page'],
                'bounding_box': {
                    'top': bounding_box['Top'],
                    'left': bounding_box['Left'],
                    'width': bounding_box['Width'],
                    'height': bounding_box['Height']
                }
            }
            
            print('Confidence: ' + "{:.2f}".format(block['Confidence']) + "%")

            print('Id: {}'.format(block['Id']))
            if 'Relationships' in block:
                print('Relationships: {}'.format(block['Relationships']))
                text_array = get_relationship_text(blocks, block['Id'])
                identified['text'] = " ".join(text_array)
            print('Bounding Box: {}'.format(block['Geometry']['BoundingBox']))
            print('Polygon: {}'.format(block['Geometry']['Polygon']))
            print()
            result.append(identified)

    return result

def get_relationship_text(blocks, id, text_array = []):
    for block in blocks:
        if block.get('Id') == id:
            if block.get('BlockType') == 'WORD':
                text_array.append(block.get('Text'))
            if 'Relationships' in block:
                print('Relationships: {}'.format(block['Relationships']))
                for relationship in block.get('Relationships'):
                    if relationship.get('type') == 'CHILD':
                        for id in relationship.get('Ids'):
                            get_relationship_text(blocks, id, text_array)
    return text_array

def download_file(bucket, key):
  filename = os.path.basename(key)
  tmp_file_path = f'/tmp/{filename}'
  s3.download_file(bucket, key, tmp_file_path)
  return tmp_file_path

#result = list_document_images('market-watch150330-demo', 'public/1026b3d1-c3a6-45f9-a50c-49b0f7807768/889b3156-2096-4798-8432-b9abcbdc0b25.json')
#print(result)