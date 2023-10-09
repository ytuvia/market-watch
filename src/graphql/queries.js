/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        items {
          id
          filename
          content
          createdAt
          updatedAt
          entityDocumentsId
          __typename
        }
        nextToken
        __typename
      }
      answers {
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
      createdAt
      updatedAt
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
        documents {
          nextToken
          __typename
        }
        answers {
          nextToken
          __typename
        }
        createdAt
        updatedAt
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
      content
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
        content
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
