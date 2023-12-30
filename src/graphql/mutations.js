/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const removeEntity = /* GraphQL */ `
  mutation RemoveEntity($args: RemoveEntityInput) {
    removeEntity(args: $args)
  }
`;
export const runAssistant = /* GraphQL */ `
  mutation RunAssistant($entity_id: ID!, $thread_id: ID!, $message: String!) {
    runAssistant(
      entity_id: $entity_id
      thread_id: $thread_id
      message: $message
    )
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
export const updateEntity = /* GraphQL */ `
  mutation UpdateEntity(
    $input: UpdateEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    updateEntity(input: $input, condition: $condition) {
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
export const deleteEntity = /* GraphQL */ `
  mutation DeleteEntity(
    $input: DeleteEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    deleteEntity(input: $input, condition: $condition) {
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
export const createEntityAssistant = /* GraphQL */ `
  mutation CreateEntityAssistant(
    $input: CreateEntityAssistantInput!
    $condition: ModelEntityAssistantConditionInput
  ) {
    createEntityAssistant(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateEntityAssistant = /* GraphQL */ `
  mutation UpdateEntityAssistant(
    $input: UpdateEntityAssistantInput!
    $condition: ModelEntityAssistantConditionInput
  ) {
    updateEntityAssistant(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteEntityAssistant = /* GraphQL */ `
  mutation DeleteEntityAssistant(
    $input: DeleteEntityAssistantInput!
    $condition: ModelEntityAssistantConditionInput
  ) {
    deleteEntityAssistant(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createEntityThread = /* GraphQL */ `
  mutation CreateEntityThread(
    $input: CreateEntityThreadInput!
    $condition: ModelEntityThreadConditionInput
  ) {
    createEntityThread(input: $input, condition: $condition) {
      id
      status
      title
      createdAt
      updatedAt
      entityThreadsId
      __typename
    }
  }
`;
export const updateEntityThread = /* GraphQL */ `
  mutation UpdateEntityThread(
    $input: UpdateEntityThreadInput!
    $condition: ModelEntityThreadConditionInput
  ) {
    updateEntityThread(input: $input, condition: $condition) {
      id
      status
      title
      createdAt
      updatedAt
      entityThreadsId
      __typename
    }
  }
`;
export const deleteEntityThread = /* GraphQL */ `
  mutation DeleteEntityThread(
    $input: DeleteEntityThreadInput!
    $condition: ModelEntityThreadConditionInput
  ) {
    deleteEntityThread(input: $input, condition: $condition) {
      id
      status
      title
      createdAt
      updatedAt
      entityThreadsId
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
