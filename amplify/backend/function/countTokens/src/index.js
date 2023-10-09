/* Amplify Params - DO NOT EDIT
	API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT
	API_MARKETWATCH_GRAPHQLAPIIDOUTPUT
	API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { executeQuery } = require("./appsync");
const { Tiktoken } = require("@dqbd/tiktoken/lite");
const { load } = require("@dqbd/tiktoken/load");
const registry = require("@dqbd/tiktoken/registry.json");
const models = require("@dqbd/tiktoken/model_to_encoding.json");

GPT_MODEL = "gpt-3.5-turbo" 

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const id = event.arguments.id;
    const document = await get_document(id);
    const model = await load(registry[models[GPT_MODEL]]);
    const encoder = new Tiktoken(
        model.bpe_ranks,
        model.special_tokens,
        model.pat_str
    );
    const tokens = encoder.encode(document.content);
    const tokenLength = tokens.length;
    console.log(tokenLength);
    encoder.free();

    return tokenLength;
};

async function get_document(id){
    const variables = {
        id: id
    };
    const query = `query GetDocument($id: ID!) {
        getDocument(id: $id) {
            id
            content
        }
    }`
    let result = await executeQuery(query, variables);
    return result.data?.getDocument;
}
