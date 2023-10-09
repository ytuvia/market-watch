export type AmplifyDependentResourcesAttributes = {
  "api": {
    "marketwatch": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    },
    "restapicontainer": {
      "ApiName": "string",
      "ClusterName": "string",
      "ContainerNames": "string",
      "PipelineName": "string",
      "RootUrl": "string",
      "ServiceName": "string"
    }
  },
  "auth": {
    "marketwatch53bd761f": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "countTokens": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "deleteEntity": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "documentHandler": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "content": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}