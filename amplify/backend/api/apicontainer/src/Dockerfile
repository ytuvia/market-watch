FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

RUN apt-get update && apt-get -y install poppler-utils

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

ENV REGION=us-west-2
ENV STORAGE_CONTENT_BUCKETNAME=market-watch142426-demo

# for Amplify 
# https://docs.amplify.aws/cli/usage/containers#deploy-a-single-container
EXPOSE 80

COPY ./app /app
