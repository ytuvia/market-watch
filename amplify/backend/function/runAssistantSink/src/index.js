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
        const result = await postRunAssistant(message);
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


const postRunAssistant = async (message) => {
    let data = JSON.stringify(message);
    
    let config = {
        method: 'post',
        url: process.env.API_ENDPOINT + '/thread/run',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    console.log(config);
    const response = await axios.request(config);
    console.log(response);
    return response.data;
}

