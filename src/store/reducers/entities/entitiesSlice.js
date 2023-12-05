import { createSlice, nanoid, createAsyncThunk  } from '@reduxjs/toolkit'
import { API, graphqlOperation } from 'aws-amplify';
import { listEntities, countDocuments, countAnswers, countThreads } from 'graphql/queries';
import { createEntity, createAnswer, removeEntity } from 'graphql/mutations';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import awsExports from 'aws-exports';

const API_ENDPOINT = awsExports.aws_cloud_logic_custom[0].endpoint;

const initialState = {
  entities: [],
  status: 'idle',
  error: null
}

export const fetchEntities = createAsyncThunk('entities/fetchEntities', async () => {
  const result = await API.graphql(graphqlOperation(listEntities));
  const entities = result.data.listEntities.items;
  for(const entity of entities){
    const documentCountResult = await API.graphql(graphqlOperation(countDocuments, {
      'id': entity.id,
    }));
    entity.documentCount =  documentCountResult.data.countDocuments;

    const threadsCountResult = await API.graphql(graphqlOperation(countThreads, {
      'id': entity.id,
    }));
    entity.threadsCount = threadsCountResult.data.countThreads;
  }
  return entities;
})

export const fetchAnswers = createAsyncThunk(
  'entities/answers',
  async initialEntity => {
    const answers = await getEntityAnswers(initialEntity.id);
    return answers;
  }
)

const getEntityAnswers = async (id, items=[], nextToken=null) => {
  const result = await API.graphql(graphqlOperation(`
      query GetEntity($id: ID!, $nextToken: String) {
        getEntity(id: $id) {
          answers(nextToken: $nextToken) {
              items {
                  id,
                  question,
                  answer,
                  createdAt,
                  updatedAt
              }
              nextToken
          }
        }
      }
    `, {
      'id': id,
  }));
  nextToken = result.data?.getEntity.answers.nextToken;
  items = [...items, ...result.data?.getEntity.answers.items];
  if(nextToken){
      const next = await getEntityAnswers(id, items, nextToken);
      items = [...items, ...next];
  }
  return items;
}

export const fetchDocumentsPage = createAsyncThunk(
  'entities/document',
  async initialEntity => {
    const result = await getEntityDocuments(initialEntity.id, initialEntity.nextToken);
    return result;
  }
)

const getEntityDocuments = async (id, nextToken=null) => {
  const result = await API.graphql(graphqlOperation(`
      query GetEntity($id: ID!, $nextToken: String) {
        getEntity(id: $id) {
          documents(nextToken: $nextToken) {
              items {
                  id,
                  filename,
                  createdAt,
                  updatedAt
              }
              nextToken
          }
        }
      }
    `, {
      'id': id,
  }));
  nextToken = result.data?.getEntity.documents.nextToken;
  const items = result.data?.getEntity.documents.items;
  return {
    items: items,
    nextToken: nextToken
  }
}

const getAllEntityDocuments = async (id, items=[], nextToken=null) => {
  const result = await API.graphql(graphqlOperation(`
      query GetEntity($id: ID!, $nextToken: String) {
        getEntity(id: $id) {
          documents(nextToken: $nextToken) {
              items {
                  id,
                  filename,
                  createdAt,
                  updatedAt
              }
              nextToken
          }
        }
      }
    `, {
      'id': id,
  }));
  nextToken = result.data?.getEntity.documents.nextToken;
  items = [...items, ...result.data?.getEntity.documents.items];
  if(nextToken){
      const next = await getEntityDocuments(id, items, nextToken);
      items = [...items, ...next];
  }
  return items;
}

export const addEntity = createAsyncThunk(
  'entities/createEntity',
  async initialEntity => {
    const result = await API.graphql(graphqlOperation(createEntity, {
      'input':{
        'name': initialEntity.name
      }
    }));
    let entity = result.data.createEntity;
    return {
      id: entity.id,
      name: entity.name,
      documentCount: 0,
      threadsCount: 0
    };
  }
)

export const deleteEntity = createAsyncThunk(
  'entities/deleteEntity',
  async initialEntity => {
    const result = await API.graphql(graphqlOperation(removeEntity, {
      'args':{
          'id': initialEntity.id
      }
    }));
    return result.data.removeEntity;
  }
)

export const uploadDocument = createAsyncThunk(
  'entities/uploadDocument',
  async initialDocument => {
    const id = initialDocument.id;
    const file = initialDocument.file;
    const uuid = uuidv4();
    const mime = file.type;
    const parts = mime.split('/');
    let filetype = '';
    if (parts.length === 2) {
      filetype =  parts[1];
    }
    const key = id +'/' + uuid + '.' + filetype;
    const result = await Storage.put(key, file, {
      contentType: mime, // contentType is optional
    });
    return result;
  }
)

export const askQuestion = createAsyncThunk(
  'entities/askQuestion',
  async initialQuestion => {
    const postData = {
      'entity_id': initialQuestion.id,
      'question': initialQuestion.question
    }
    const response = await axios.post(API_ENDPOINT + '/ask', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.answer;
  }
)

export const saveAnswer = createAsyncThunk(
  'entities/saveAnswer',
  async initialAnswer => {
    await API.graphql(graphqlOperation(createAnswer, {
      'input': {
        'question': initialAnswer.question,
        'answer': initialAnswer.answer,
        'entityAnswersId': initialAnswer.id
      }
    }));
  }
)

export const deleteEmbedding = createAsyncThunk(
  'entities/delete_embedding',
  async initialData => {
    const postData = {
      'entity_id': initialData.id,
    }
    const response = await axios.post(API_ENDPOINT + '/entity/remove_embedding', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }
)

export const deleteDocument = createAsyncThunk(
  'document/delete',
  async initialData => {
    const postData = {
      'document_id': initialData.id,
    }
    const response = await axios.post(API_ENDPOINT + '/document/delete', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }
)

const entities = createSlice({
  name: 'entities',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEntities.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.entities = action.payload
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(fetchAnswers.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(fetchDocumentsPage.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchDocumentsPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.meta.arg.id;
        const entity = state.entities.find(entity=>entity.id == id);
        entity.documents = action.payload.items;
      })
      .addCase(fetchDocumentsPage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(addEntity.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addEntity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities.push(action.payload);
      })
      .addCase(addEntity.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(deleteEntity.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteEntity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = state.entities.filter(item => item.id !== action.meta.arg.id);
      })
      .addCase(deleteEntity.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(saveAnswer.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(saveAnswer.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const id = action.meta.arg.id;
        const entity = state.entities.find(entity=>entity.id == id);
        entity.answerCount = entity.answerCount+1;
      })
      .addCase(saveAnswer.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      
      .addCase(uploadDocument.pending, (state, action) => {
        console.log(action);
        state.status = 'loading';
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.meta.arg.id;
        const entity = state.entities.find(entity=>entity.id == id);
        entity.documentCount = entity.documentCount+1;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(askQuestion.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(deleteEmbedding.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteEmbedding.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(deleteEmbedding.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(deleteDocument.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const document_id = action.meta.arg.id;
        const entity_id = action.payload.entityDocumentsId;
        const entity = state.entities.find(entity=>entity.id == entity_id);
        entity.documents = entity.documents.filter(document=>document.id===document_id);
        entity.documentCount = entity.documentCount - 1
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

  }
})

export default entities.reducer

export const selectAllEntities = state => state.entities.entities

export const selectEntityById = (state, entityId) =>
  state.entities.entities.find(entity => entity.id === entityId)

export const selectEntityDocuments = (state, entityId) => {
  const entity = state.entities.entities.find(entity => entity.id === entityId);

  return entity.documents;
}
