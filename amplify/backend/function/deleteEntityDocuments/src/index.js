/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["OPENAI_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT
	API_MARKETWATCH_GRAPHQLAPIIDOUTPUT
	API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
	STORAGE_CONTENT_BUCKETNAME
Amplify Params - DO NOT EDIT */

const { executeQuery } = require("./appsync");
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
    console.log(apiKey);
    openai = new OpenAI({ apiKey: apiKey })

    let results = [];
    for(const record of event.Records){
        const eventJson = JSON.parse(record.body);
        const message = JSON.parse(eventJson.Message);
        const result = await handleMessage(message.document);
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

const handleMessage = async (document) => {
    await delete_embeddings(document.id);
    await delete_document(document.id);
    await delete_file(`public/${document.entityId}/${document.filename}`);
    return document.id
}


async function delete_embeddings(id){
    const file = await openai.beta.files.delete({
        file_id: id
    });
    return file;
}


async function delete_file(key) {
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


async function delete_document(id){
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

async function getSecret(secret_name){
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
