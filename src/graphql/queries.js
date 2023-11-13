/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const countDocuments = /* GraphQL */ `
  query CountDocuments($id: ID!) {
    countDocuments(id: $id)
  }
`;
export const countAnswers = /* GraphQL */ `
  query CountAnswers($id: ID!) {
    countAnswers(id: $id)
  }
`;
export const countTokens = /* GraphQL */ `
  query CountTokens($id: ID!) {
    countTokens(id: $id)
  }
`;
export const getEntity = /* GraphQL */ `
  query GetEntity($id: ID!) {
    getEntity(id: $id) {
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
export const listEntities = /* GraphQL */ `
  query ListEntities(
    $filter: ModelEntityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        entityAssistantId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEntityAssistant = /* GraphQL */ `
  query GetEntityAssistant($id: ID!) {
    getEntityAssistant(id: $id) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEntityAssistants = /* GraphQL */ `
  query ListEntityAssistants(
    $filter: ModelEntityAssistantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntityAssistants(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEntityThread = /* GraphQL */ `
  query GetEntityThread($id: ID!) {
    getEntityThread(id: $id) {
      id
      status
      createdAt
      updatedAt
      entityThreadsId
      __typename
    }
  }
`;
export const listEntityThreads = /* GraphQL */ `
  query ListEntityThreads(
    $filter: ModelEntityThreadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntityThreads(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        status
        createdAt
        updatedAt
        entityThreadsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      filename
      createdAt
      updatedAt
      entityDocumentsId
      __typename
    }
  }
`;
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        filename
        createdAt
        updatedAt
        entityDocumentsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAnswer = /* GraphQL */ `
  query GetAnswer($id: ID!) {
    getAnswer(id: $id) {
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
export const listAnswers = /* GraphQL */ `
  query ListAnswers(
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        question
        answer
        createdAt
        updatedAt
        entityAnswersId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
