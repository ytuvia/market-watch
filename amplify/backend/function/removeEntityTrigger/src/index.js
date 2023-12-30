
const AWS = require("aws-sdk");
const  sns = new AWS.SNS({apiVersion: '2010-03-31'});

let SNS_ARN;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let awsAccountId = "896812843445";
    if(context.invokedFunctionArn){
        const arn = context.invokedFunctionArn.split(':');
        if(arn.length > 3){
            awsAccountId = arn[4] 
        }
    }

    SNS_ARN = `arn:aws:sns:${process.env.REGION}:${awsAccountId}:remove-entity-sns-topic-sns-topic-marketwatch-${process.env.ENV}`;
    const entity_id = event.arguments.id;
    await send_sns({
      id: entity_id,
    });

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Hello from Lambda!'),
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
