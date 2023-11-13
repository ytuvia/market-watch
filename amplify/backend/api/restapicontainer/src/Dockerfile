FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

ENV REGION=us-west-2

ENV OPENAPI_KEY=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
ENV PG_DSN=postgresql://postgres:mcFwHct7369FWba@market-watch-vector.co21yocebc1p.us-west-2.rds.amazonaws.com:5432/marketwatch

# for Amplify 
# https://docs.amplify.aws/cli/usage/containers#deploy-a-single-container
EXPOSE 80

COPY ./app /app
