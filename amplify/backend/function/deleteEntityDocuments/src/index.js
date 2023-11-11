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
const { Pool } = require('pg');

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
    // Configure the PostgreSQL connection settings
    const pool = new Pool({
        user: 'postgres',
        host: 'market-watch-vector.co21yocebc1p.us-west-2.rds.amazonaws.com',
        database: 'marketwatch',
        password: 'mcFwHct7369FWba',
        port: 5432, // Default PostgreSQL port
    });
  
    // Define the SQL query to delete documents from your table
    const deleteQuery = `
    DELETE FROM documents
    WHERE id = $1;
    `;

    // Parameters for the query (e.g., the value you want to match for deletion)
    const queryParams = [id];

    return new Promise((resolve, reject) => {
        // Execute the delete query
        pool.query(deleteQuery, queryParams, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                console.log('Deleted', result.rowCount, 'documents.');
                resolve(result.rowCount);
            }

            // Close the database connection
            pool.end();
        });
    })
}


async function delete_file(key) {
    const params = {
        "Bucket": process.env.STORAGE_CONTENT_BUCKETNAME,
        "Key": key,
    };
    console.log(params);
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
