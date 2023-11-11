/* Amplify Params - DO NOT EDIT
	API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT
	API_MARKETWATCH_GRAPHQLAPIIDOUTPUT
	API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { executeQuery } = require("./appsync");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const  sns = new AWS.SNS({apiVersion: '2010-03-31'});
const axios = require('axios');

let SNS_ARN;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(`EVENT: ${JSON.stringify(context)}`);
    //arn:aws:sns:us-west-2:271936189865:document-handler-sns-topic-marketwatch-main
    let awsAccountId = "271936189865";
    if(context.invokedFunctionArn){
        const arn = context.invokedFunctionArn.split(':');
        if(arn.length > 3){
            awsAccountId = arn[4] 
        }
    }

    SNS_ARN = `arn:aws:sns:${process.env.REGION}:${awsAccountId}:document-handler-sns-topic-marketwatch-${process.env.ENV}`;
    let results = [];
    for (const record of event.Records) {
        const eventType = record.eventName;
        if(eventType=='ObjectCreated:Put' || eventType=='ObjectCreated:CompleteMultipartUpload'){
            const result = await handleMessage(record);
            results.push(result);
        }
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

const send_sns = async (message)=>{
    return new Promise((resolve, reject) => {
      sns.publish({
        Message: JSON.stringify(message),
        TopicArn: SNS_ARN
      }, (err, data)=>{
        if (err) {
          console.log(err, err.stack);
          return reject(err);
        }else{
          return resolve(data);
        }
      })
    })
  }

async function handleMessage(message){
    let results = [];
    const object = message.s3.object;
    const bucket = message.s3.bucket;
    let key = object.key;
    let folders = key.split('/').slice(0, -1);
    let entityId = folders[folders.length - 1];

    const fileInfo = await getFileInfo(bucket.name, key);
    const contentType = fileInfo.ContentType;

    switch(contentType){
        case 'application/pdf':
            const content = await readPdf(bucket.name, key)
            const result = await send_sns({
                entityId: entityId,
                key: key,
                content: content
            });
            results.push(result);
            break;
        case 'text/csv':
            const contents = await readCsv(bucket.name, key);
            console.log('-----contents-----');
            console.log(contents.length);
            for(const content of contents){
                await send_sns({
                    entityId: entityId,
                    key: key,
                    content: content
                });
            }
            break;
    }
    return results;
}

async function getFileInfo(bucket, key) {
    const params = {
        "Bucket": bucket,
        "Key": key,
    };
    let s3Action = await new Promise((resolve, reject) => {
        s3.headObject(params, function (err, data) {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });


    return s3Action;
}

async function readPdf(bucket, key){
    let data = JSON.stringify({
        "bucket": bucket,
        "key": key
    });
    
    let config = {
        method: 'post',
        url: process.env.RESTAPI_ENDPOINT + '/read_pdf',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    const response = await axios.request(config);
    return response.data;
}

async function readCsv(bucket, key){
    let data = JSON.stringify({
        "bucket": bucket,
        "key": key
    });
    let config = {
        method: 'post',
        url: process.env.RESTAPI_ENDPOINT + '/read_csv',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    const response = await axios.request(config);
    return response.data;
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
