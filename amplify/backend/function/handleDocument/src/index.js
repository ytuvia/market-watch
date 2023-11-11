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
const  sns = new AWS.SNS({apiVersion: '2010-03-31'});
const axios = require('axios');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let results = [];
    for(const record of event.Records){
        const eventJson = JSON.parse(record.body);
        const message = JSON.parse(eventJson.Message);
        const result = await handleMessage(message.entityId, message.key, message.content);
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

async function handleMessage(entityId, key, content){
    const document = await createDocument(entityId, key, content);
    if(Boolean(process.env.DO_TRANSLATE)){
        await translateDocument(document.id);
    }
    await embedDocument(document.id);

    return document.id;
}

async function translateDocument(id){
    let data = JSON.stringify({
        "document_id": id,
        "source_lang": "he",
        "target_lang": "en"
    });
    
    let config = {
        method: 'post',
        url: process.env.RESTAPI_ENDPOINT + '/translate',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    const response = await axios.request(config);
    return response.data;
}

async function embedDocument(id){
    let data = JSON.stringify({
        document_id: id
    });
    
    
    let config = {
        method: 'post',
        url: process.env.RESTAPI_ENDPOINT + '/embed/document',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    const response = await axios.request(config);
    return response.data;
}

async function createDocument(entityId, filename, content){
    const variables = {
        'input': {
            'filename': filename,
            'content': content,
            'entityDocumentsId': entityId
        }
    };
    const query = `mutation createDocument($input: CreateDocumentInput!) {
        createDocument(input: $input){
            id
            filename
            content
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data?.createDocument;
}

