/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEntity = /* GraphQL */ `
  subscription OnCreateEntity($filter: ModelSubscriptionEntityFilterInput) {
    onCreateEntity(filter: $filter) {
      id
      name
      documents {
        nextToken
        __typename
      }
      answers {
        nextToken
        __typename
      }
      assistant {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      threads {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      entityAssistantId
      __typename
    }
  }
`;
export const onUpdateEntity = /* GraphQL */ `
  subscription OnUpdateEntity($filter: ModelSubscriptionEntityFilterInput) {
    onUpdateEntity(filter: $filter) {
      id
      name
      documents {
        nextToken
        __typename
      }
      answers {
        nextToken
        __typename
      }
      assistant {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      threads {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      entityAssistantId
      __typename
    }
  }
`;
export const onDeleteEntity = /* GraphQL */ `
  subscription OnDeleteEntity($filter: ModelSubscriptionEntityFilterInput) {
    onDeleteEntity(filter: $filter) {
      id
      name
      documents {
        nextToken
        __typename
      }
      answers {
        nextToken
        __typename
      }
      assistant {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      threads {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      entityAssistantId
      __typename
    }
  }
`;
export const onCreateEntityAssistant = /* GraphQL */ `
  subscription OnCreateEntityAssistant(
    $filter: ModelSubscriptionEntityAssistantFilterInput
  ) {
    onCreateEntityAssistant(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateEntityAssistant = /* GraphQL */ `
  subscription OnUpdateEntityAssistant(
    $filter: ModelSubscriptionEntityAssistantFilterInput
  ) {
    onUpdateEntityAssistant(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteEntityAssistant = /* GraphQL */ `
  subscription OnDeleteEntityAssistant(
    $filter: ModelSubscriptionEntityAssistantFilterInput
  ) {
    onDeleteEntityAssistant(filter: $filter) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateEntityThread = /* GraphQL */ `
  subscription OnCreateEntityThread(
    $filter: ModelSubscriptionEntityThreadFilterInput
  ) {
    onCreateEntityThread(filter: $filter) {
      id
      status
      createdAt
      updatedAt
      entityThreadsId
      __typename
    }
  }
`;
export const onUpdateEntityThread = /* GraphQL */ `
  subscription OnUpdateEntityThread(
    $filter: ModelSubscriptionEntityThreadFilterInput
  ) {
    onUpdateEntityThread(filter: $filter) {
      id
      status
      createdAt
      updatedAt
      entityThreadsId
      __typename
    }
  }
`;
export const onDeleteEntityThread = /* GraphQL */ `
  subscription OnDeleteEntityThread(
    $filter: ModelSubscriptionEntityThreadFilterInput
  ) {
    onDeleteEntityThread(filter: $filter) {
      id
      status
      createdAt
      updatedAt
      entityThreadsId
      __typename
    }
  }
`;
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onCreateDocument(filter: $filter) {
      id
      filename
      createdAt
      updatedAt
      entityDocumentsId
      __typename
    }
  }
`;
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onUpdateDocument(filter: $filter) {
      id
      filename
      createdAt
      updatedAt
      entityDocumentsId
      __typename
    }
  }
`;
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onDeleteDocument(filter: $filter) {
      id
      filename
      createdAt
      updatedAt
      entityDocumentsId
      __typename
    }
  }
`;
export const onCreateAnswer = /* GraphQL */ `
  subscription OnCreateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onCreateAnswer(filter: $filter) {
      id
      question
      answer
      createdAt
      updatedAt
      entityAnswersId
      __typename
    }
  }
`;
export const onUpdateAnswer = /* GraphQL */ `
  subscription OnUpdateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onUpdateAnswer(filter: $filter) {
      id
      question
      answer
      createdAt
      updatedAt
      entityAnswersId
      __typename
    }
  }
`;
export const onDeleteAnswer = /* GraphQL */ `
  subscription OnDeleteAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onDeleteAnswer(filter: $filter) {
      id
      question
      answer
      createdAt
      updatedAt
      entityAnswersId
      __typename
    }
  }
`;
