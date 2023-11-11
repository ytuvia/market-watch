const https = require('https');
const urlParse = require("url").URL;
const AWS = require("aws-sdk");

async function executeQuery(query, variables) {
    const endpoint = new urlParse(process.env.API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT).hostname.toString();
    const req = new AWS.HttpRequest(process.env.API_MARKETWATCH_GRAPHQLAPIENDPOINTOUTPUT, process.env.REGION);
    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    let operation = {
		query: query,
		variables: variables
	};
    req.body = JSON.stringify(operation);
  
    req.headers["x-api-key"] = process.env.API_MARKETWATCH_GRAPHQLAPIKEYOUTPUT;

    const data = await new Promise((resolve, reject) => {
      const httpRequest = https.request({
        ...req,
        host: endpoint
      }, (result) => {
        let data = "";
  
        result.on("data", (chunk) => {
          data += chunk;
        });
  
        result.on("end", () => {
          resolve(JSON.parse(data.toString()));
        });
      });
  
      httpRequest.write(req.body);
      httpRequest.end();
    });
    return data;
};

module.exports.executeQuery = executeQuery;