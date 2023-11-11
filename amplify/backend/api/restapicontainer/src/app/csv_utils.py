import pandas as pd
import boto3
import os

s3 = boto3.client('s3')

def read_csv_file(bucket, key):
    localfile = download_file(bucket, key)
    content = read_file(localfile)
    return content

def download_file(bucket, key):
    filename = os.path.basename(key)
    tmp_file_path = f'/tmp/{filename}'
    s3.download_file(bucket, key, tmp_file_path)
    return tmp_file_path

def read_file(localfile):
    df = pd.read_csv(localfile)
    print(df.shape[0])
    separator=' '
    result_array = []
    for _, row in df.iterrows():
        row_str = separator.join(f"{col}: {row[col]}" for col in df.columns if pd.notna(row[col]))
        result_array.append(row_str)

    return result_array 