import * as cdk from 'aws-cdk-lib';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import { Construct } from 'constructs';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });


    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo()
    const sqsQueueResourceNamePrefix = `run-assistant-sqs-queue-${amplifyProjectInfo.projectName}`
    const queue = new sqs.Queue(this, 'RunAssistantSQsQueue', {
      queueName: `${sqsQueueResourceNamePrefix}-${cdk.Fn.ref('env')}`,
      visibilityTimeout: cdk.Duration.seconds(900)
    })

    // 👇create sns topic
    const snsTopicResourceNamePrefix = `run-assistant-sns-topic-${amplifyProjectInfo.projectName}`
    const topic = new sns.Topic(this, 'RunAssistantSnsTopic', {
      topicName: `${snsTopicResourceNamePrefix}-${cdk.Fn.ref('env')}`
    })
    
    // 👇 subscribe queue to topic
    topic.addSubscription(new subs.SqsSubscription(queue))
    new cdk.CfnOutput(this, 'RunAssistantSnsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    })

    const dependencies: AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this,
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [{
        category: "function", // api, auth, storage, function, etc.
        resourceName: "runAssistantSink" // find the resource at "amplify/backend/<category>/<resourceName>"
      } /* add more dependencies as needed */] 
    );

    const lmbdFuncArn = cdk.Fn.ref(dependencies.function.runAssistantSink.Arn)
    
    const lmbdFunc = lambda.Function.fromFunctionArn(this, 'LambdaSink', lmbdFuncArn)

    // 👇 add sqs queue as event source for lambda
    lmbdFunc.addEventSource(
      new SqsEventSource(queue, {
          batchSize: 10,
      }),
    );

  }
}