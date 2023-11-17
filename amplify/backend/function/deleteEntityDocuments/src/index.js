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

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
});

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
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
