/* Amplify Params - DO NOT EDIT
	API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT
	API_MARKETWATCH_GRAPHQLAPIIDOUTPUT
	API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { executeQuery } = require("./appsync");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const id = event.arguments.id;
    const items = await get_entity_documents(id);
    return items.length;
};


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
