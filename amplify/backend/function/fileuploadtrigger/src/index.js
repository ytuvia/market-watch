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
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
});


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(`EVENT: ${JSON.stringify(context)}`);
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


async function handleMessage(message){
    //let results = [];
    const object = message.s3.object;
    const bucket = message.s3.bucket;
    let key = object.key;
    const folders = key.split('/').slice(0, -1);
    const filename = folders[folders.length-1];
    const entityId = folders[folders.length - 1];
    const localfile = `/tmp/${filename}`;
    const localFileStream = fs.createWriteStream(localfile);
    
    let s3Action = await new Promise((resolve, reject) => {
        const params = {
            Bucket: bucket.name,
            Key: key
        };
        console.log(params);
        s3.getObject(params)
            .createReadStream()
            .pipe(localFileStream)
            .on('error', (err) => {
                console.error('Error downloading file:', err);
                return reject(err)
            })
            .on('finish', async () => {
                console.log('File downloaded successfully and saved locally');
                const file = await emmbed_file(localfile);
                const document = await createDocument(file.id, entityId, key);
                return resolve(document);
            });
    })

    return s3Action;
    
}

async function emmbed_file(localfile) {
    const file = await openai.files.create({
        file: fs.createReadStream(localfile),
        purpose: "assistants",
    });
    return file;
}

async function createDocument(id, entityId, filename){
    const variables = {
        'input': {
            'id': id,
            'filename': filename,
            'entityDocumentsId': entityId
        }
    };
    const query = `mutation createDocument($input: CreateDocumentInput!) {
        createDocument(input: $input){
            id
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data?.createDocument;
}
