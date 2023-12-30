/* Amplify Params - DO NOT EDIT
	API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT
	API_MARKETWATCH_GRAPHQLAPIIDOUTPUT
	API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
	STORAGE_CONTENT_BUCKETNAME
Amplify Params - DO NOT EDIT */const { executeQuery } = require("./appsync");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const OpenAI = require('openai');
const {
    SecretsManagerClient,
    GetSecretValueCommand,
  } = require("@aws-sdk/client-secrets-manager");

let openai;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const apiKey = await getSecret('OPENAI_API_KEY');
    openai = new OpenAI({ apiKey: apiKey });
    let results = [];
    for(const record of event.Records){
        const eventJson = JSON.parse(record.body);
        const message = JSON.parse(eventJson.Message);
        const result = await handleMessage(message);
        results.push(result);
    }

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify(results),
    };
};

const handleMessage = async (message) => {
    const entity_id = message.id;
    const entity = await get_entity(entity_id);
    const documents = await get_entity_documents(entity_id);
    for(const document of documents) {
        await delete_embeddings(document.id);
        await delete_document(document.id);
        await delete_file(`public/${entity_id}/${document.filename}`);
        return document.id
    }

    const threads = await get_entity_threads(entity_id);
    console.log(threads);
    for(const thread of threads) {
        await delete_thread(thread.id);
    }

    if(entity.assistant){
        await delete_assistant(entity.assistant.id);
    }
    
    const result = await delete_entity(entity_id);
    console.log(result);
    return entity_id;
}

const getSecret = async (secret_name) => {
    const client = new SecretsManagerClient({
        region: process.env.REGION,
    });
    
    let response;
    
    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }
    
    const secret = response.SecretString;
    return secret;
}

const get_entity = async (id) => {
    const variables = {
        id: id
    };
    const query = `query GetEntity($id: ID!) {
        getEntity(id: $id) {
            id,
            assistant {
                id
            }
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data.getEntity
}

const get_entity_documents = async (id, items=[], nextToken=null) => {
    const variables = {
        id: id,
        nextToken: nextToken
    };
    const query = `query GetEntity($id: ID!, $nextToken: String) {
        getEntity(id: $id) {
            documents(nextToken: $nextToken) {
                items {
                    id
                    filename
                }
                nextToken
            }
        }
    }`
    let result = await executeQuery(query, variables);
    nextToken = result.data?.getEntity.documents.nextToken;
    items = [...items, ...result.data?.getEntity.documents.items];
    if(nextToken){
        items = await get_entity_documents(id, items, nextToken);
    }
    return items
}

const get_entity_threads = async (id, items=[], nextToken=null) => {
    const variables = {
        id: id,
        nextToken: nextToken
    };
    const query = `query GetEntity($id: ID!, $nextToken: String) {
        getEntity(id: $id) {
            threads(nextToken: $nextToken) {
                items {
                    id
                }
                nextToken
            }
        }
    }`
    let result = await executeQuery(query, variables);
    nextToken = result.data?.getEntity.threads.nextToken;
    items = [...items, ...result.data?.getEntity.threads.items];
    if(nextToken){
        items = await get_entity_answers(id, items, nextToken);
    }
    return items
}

const delete_embeddings = async (id) => {
    try{
        const file = await openai.files.del({
            file_id: id
        });
        return file;
    }catch(e){
        console.log(e);
        return null;
    }
}

const delete_document = async (id) => {
    const variables = {
        id: id
    };
    const query = `mutation DeleteDocument($id: ID!) {
        deleteDocument(input: {id: $id}) {
            id
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data?.deleteDocument;
}

const delete_file = async (key) => {
    const params = {
        "Bucket": process.env.STORAGE_CONTENT_BUCKETNAME,
        "Key": key,
    };
    let s3Action = await new Promise((resolve, reject) => {
        s3.deleteObject(params, function (err, data) {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });

    return s3Action;
}

const delete_thread = async (id) => {
    try{
        const thread = await openai.beta.threads.del({
            thread_id: id
        });
        return thread;
    }catch(e){
        console.log(e);
        return null;
    }
}

const delete_assistant = async (id) => {
    try{
        const assistant = await openai.beta.assistants.del({
            assistant_id: id
        });
        return assistant;
    }catch(e){
        console.log(e);
        return null;
    }
}

const delete_entity = async (id)=>{
    const variables = {
        id: id
    };
    const query = `mutation DeleteEntity($id: ID!) {
        deleteEntity(input: {id: $id}) {
            id
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data?.deleteEntity;
}