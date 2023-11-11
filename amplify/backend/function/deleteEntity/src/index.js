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
const  sns = new AWS.SNS({apiVersion: '2010-03-31'});

let SNS_ARN;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let awsAccountId = "271936189865";
    if(context.invokedFunctionArn){
        const arn = context.invokedFunctionArn.split(':');
        if(arn.length > 3){
            awsAccountId = arn[4] 
        }
    }

    SNS_ARN = `arn:aws:sns:${process.env.REGION}:${awsAccountId}:delete-entity-documents-sns-topic-marketwatch-${process.env.ENV}`;
    const id = event.arguments.args.id;
    const documents = await get_entity_documents(id);
    for(const document of documents) {
        await send_sns({
            'document':{
                id: document.id,
                filename: document.filename,
                entityId: id
            }
        })
    }

    const answers = await get_entity_answers(id);
    for(const answer of answers) {
        await delete_answer(answer.id);
    }
    await delete_entity(id);

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify(id),
    };
};


async function send_sns(message){
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


async function get_entity_documents(id, items=[], nextToken=null){
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

async function get_entity_answers(id, items=[], nextToken=null){
    const variables = {
        id: id,
        nextToken: nextToken
    };
    const query = `query GetEntity($id: ID!, $nextToken: String) {
        getEntity(id: $id) {
            answers(nextToken: $nextToken) {
                items {
                    id
                }
                nextToken
            }
        }
    }`
    let result = await executeQuery(query, variables);
    nextToken = result.data?.getEntity.answers.nextToken;
    items = [...items, ...result.data?.getEntity.answers.items];
    if(nextToken){
        items = await get_entity_answers(id, items, nextToken);
    }
    return items
}

async function delete_answer(id){
    const variables = {
        id: id
    };
    const query = `mutation DeleteAnswer($id: ID!) {
        deleteAnswer(input: {id: $id}) {
            id
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data?.deleteAnswer;
}

async function delete_entity(id){
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

