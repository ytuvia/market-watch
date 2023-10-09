/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const removeEntity = /* GraphQL */ `
  mutation RemoveEntity($args: RemoveEntityInput) {
    removeEntity(args: $args)
  }
`;
export const createEntity = /* GraphQL */ `
  mutation CreateEntity(
    $input: CreateEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    createEntity(input: $input, condition: $condition) {
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
export const updateEntity = /* GraphQL */ `
  mutation UpdateEntity(
    $input: UpdateEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    updateEntity(input: $input, condition: $condition) {
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
export const deleteEntity = /* GraphQL */ `
  mutation DeleteEntity(
    $input: DeleteEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    deleteEntity(input: $input, condition: $condition) {
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
export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
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
export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
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
export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
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
export const createAnswer = /* GraphQL */ `
  mutation CreateAnswer(
    $input: CreateAnswerInput!
    $condition: ModelAnswerConditionInput
  ) {
    createAnswer(input: $input, condition: $condition) {
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
export const updateAnswer = /* GraphQL */ `
  mutation UpdateAnswer(
    $input: UpdateAnswerInput!
    $condition: ModelAnswerConditionInput
  ) {
    updateAnswer(input: $input, condition: $condition) {
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
export const deleteAnswer = /* GraphQL */ `
  mutation DeleteAnswer(
    $input: DeleteAnswerInput!
    $condition: ModelAnswerConditionInput
  ) {
    deleteAnswer(input: $input, condition: $condition) {
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
