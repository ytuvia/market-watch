from openai import OpenAI
import json
import os
import time

def show_json(obj):
    print(json.loads(obj.model_dump_json()))

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )


def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

client = OpenAI(
    api_key=os.environ.get('OPENAPI_KEY') 
)

assistant = client.beta.assistants.retrieve(
    assistant_id="asst_LLZ0XbZXtZ2dMMYj8mkBu3eR",
)
show_json(assistant)

thread = client.beta.threads.create()
show_json(thread)