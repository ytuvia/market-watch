/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEntity = /* GraphQL */ `
  subscription OnCreateEntity($filter: ModelSubscriptionEntityFilterInput) {
    onCreateEntity(filter: $filter) {
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
export const onUpdateEntity = /* GraphQL */ `
  subscription OnUpdateEntity($filter: ModelSubscriptionEntityFilterInput) {
    onUpdateEntity(filter: $filter) {
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
export const onDeleteEntity = /* GraphQL */ `
  subscription OnDeleteEntity($filter: ModelSubscriptionEntityFilterInput) {
    onDeleteEntity(filter: $filter) {
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
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onCreateDocument(filter: $filter) {
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
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onUpdateDocument(filter: $filter) {
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
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onDeleteDocument(filter: $filter) {
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
