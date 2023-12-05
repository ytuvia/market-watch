import requests
import json
import os
import boto3

api_key = os.environ.get('API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT', None)

def query_api(query, variables: dict):
    endpoint = os.environ.get('API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT', None)
    headers={"Content-Type": "application/json"}
    headers["x-api-key"] = api_key
    payload = {
        "query": query, 
        'variables': variables
    }

    try:
        response = requests.post(
            endpoint,
            json=payload,
            headers=headers
        ).json()
        if 'errors' in response:
            print('Error attempting to query AppSync')
            print(response['errors'])
        else:
            return response
    except Exception as exception:
        print('Error with Mutation')
        print(exception)

    return None