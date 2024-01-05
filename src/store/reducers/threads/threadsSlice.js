import { createSlice, createAsyncThunk, createSelector  } from '@reduxjs/toolkit'
import { generateClient } from 'aws-amplify/api';
import amplifyconfig from 'amplifyconfiguration.json';
import { runAssistant } from 'graphql/mutations'
import axios from 'axios';

const API_ENDPOINT = amplifyconfig.aws_cloud_logic_custom[0].endpoint;
const client = generateClient();

const initialState = {
  threads: [],
  status: 'idle',
  error: null
}

export const fetchThreadsPage = createAsyncThunk(
  'threads/list',
  async initialEntity => {
    const result = await getEntityThreads(initialEntity.id, initialEntity.nextToken);
    
    return result;
  }
)

const getEntityThreads = async (id, nextToken=null) => {
  const query = `
    query GetEntity($id: ID!, $nextToken: String) {
      getEntity(id: $id) {
        threads(nextToken: $nextToken) {
            items {
                id
                title
                status
                createdAt
                updatedAt
            }
            nextToken
        }
      }
    }
  `
  const result = await client.graphql({query: query, variables: {
      'id': id,
  }});
  nextToken = result.data?.getEntity.threads.nextToken;
  const items = result.data?.getEntity.threads.items;
  return {
    items: items,
    nextToken: nextToken
  }
}

export const fetchThreadMessages = createAsyncThunk(
  'thread/messages',
  async initialEntity => {
    const result = await geThreadMessages(initialEntity.id);
    return result.data;  
  }
)

const geThreadMessages = async (thread_id) => {
  const postData = {
    'thread_id': thread_id
  }
  const response = await axios.post(API_ENDPOINT + '/thread/messages', postData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}


export const fetchEntityThreadMessages = createAsyncThunk(
  'entity/thread',
  async initialEntity => {
    const result = await getEntityThreadMessages(initialEntity.id);
    return result.data;  
  }
)

const getEntityThreadMessages = async (id) => {
  const postData = {
    'entity_id': id
  }
  const response = await axios.post(API_ENDPOINT + '/entity/messages', postData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}

export const sendRunAssistance = createAsyncThunk(
  'entity/thread/run',
  async initialEntity => {
    const result = await callRunAssistant(initialEntity.entity_id, initialEntity.thread_id, initialEntity.message);
    return result;
  }
)

const callRunAssistant = async (entity_id, thread_id, message) => {
  const variables = {
    'entity_id': entity_id,
    'thread_id': thread_id,
    'message': message
  }

  await client.graphql({query: runAssistant, variables: variables});
  return variables;
}

export const sendClearThread = createAsyncThunk(
  'entity/thread/clear',
  async initialData => {
    const result = await clearThread(initialData.entity_id);
    return result.data;
  }
)

const clearThread = async (entity_id) => {
  const postData = {
    'entity_id': entity_id
  }
  let response = await axios.post(API_ENDPOINT + '/thread/delete', postData, {
    headers: {
      'Content-Type': 'application/json',
      
    },
  });

  return response.data;
}

export const sendClearAssistant = createAsyncThunk(
  'entity/assistant/clear',
  async initialEntity => {
    const result = await clearAssistant(initialEntity.id);
    return result.data;
  }
)

const clearAssistant = async (id) => {
  const postData = {
    'entity_id': id
  }
  let response = await axios.post(API_ENDPOINT + '/assistant/delete', postData, {
    headers: {
      'Content-Type': 'application/json',
      
    },
  });

  return response.data;
}

export const sendUpdateThreadStatus = createAsyncThunk(
  'entity/thread/status',
  async input => {
    const result = await updateThreadStatus(input.thread_id, input.thread_status);
    return result.data;
  }
)

const updateThreadStatus = async (thread_id, thread_status) => {
  const postData = {
    'thread_id': thread_id,
  }
  const response = await axios.post(API_ENDPOINT + '/thread/messages', postData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}
 
const threads = createSlice({
  name: 'threads',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEntityThreadMessages.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchEntityThreadMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const entity_id = action.meta.arg.id;
        const messages = action.payload.messages;
        const thread_id = action.payload.thread_id;
        const updated_at = action.payload.updated_at;
        const thread_status = action.payload.thread_status;
        const sorted = messages.sort((a, b) => a.created_at - b.created_at);
        let thread = state.threads.find(item=>{return item.id === thread_id})
        if(thread){
          thread = {
            id:thread_id,
            entity_id: entity_id,
            status: thread_status,
            updated_at: updated_at,
            messages: sorted
          }
        }else{
          state.threads.push({
            id:thread_id,
            entity_id: entity_id,
            status: thread_status,
            updated_at: updated_at,
            messages: sorted
          })
        }
      })
      .addCase(fetchEntityThreadMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchThreadMessages.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchThreadMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const thread = action.payload;
        const thread_id = action.payload.thread_id;
        const messages = action.payload.messages;
        const sorted = messages.sort((a, b) => a.created_at - b.created_at);
        thread.messages = sorted;
        let thread_idx = state.threads.findIndex(item=>{return item.id === thread_id});
        if(thread_idx > -1){
          state.threads[thread_idx] = thread;
        }else{
          state.threads.push(thread)
        }
      })
      .addCase(fetchThreadMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchThreadsPage.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchThreadsPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const entity_id = action.meta.arg.id;
        const threads = action.payload.items;
        const entity_threads = threads.map(item => ({ ...item, ...{entity_id: entity_id, updated_at: item.updatedAt}}));
        state.threads = entity_threads;
      })
      .addCase(fetchThreadsPage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(sendRunAssistance.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(sendRunAssistance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const message = action.payload.message;
        const entity_id = action.payload.entity_id;
        const thread_id = action.payload.thread_id;
        const thread_status = "queued";
        let thread_idx = state.threads.findIndex(item=>{return item.id === thread_id});
        let thread = state.threads[thread_idx];
        const timestamp = new Date().getTime();

        const random = Math.random().toString(36).substring(2);
        const uniqueId = timestamp + random;
        thread.messages.push({
          'id': uniqueId,
          'content': [
            {
              "type": "text",
              "text": {
                "value": message
              }
            }
          ]
        })
        const currentDate = new Date();
        state.threads[thread_idx] = {
          id:thread_id,
          entity_id: entity_id,
          status: thread_status,
          updated_at: currentDate.toLocaleString(),
          messages: thread.messages
        }

      })
      .addCase(sendRunAssistance.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(sendClearThread.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(sendClearThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const thread = action.payload;
        state.threads.push(thread);
      })
      .addCase(sendClearThread.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(sendClearAssistant.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(sendClearAssistant.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(sendClearAssistant.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(sendUpdateThreadStatus.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(sendUpdateThreadStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const messages = action.payload.messages;
        const thread_id = action.payload.thread_id;
        const updated_at = action.payload.updated_at;
        const entity_id = action.payload.entity_id;
        const thread_status = action.payload.thread_status;
        const sorted = messages.sort((a, b) => a.created_at - b.created_at);
        let thread_idx = state.threads.findIndex(item=>{return item.id === thread_id});
        state.threads[thread_idx] = {
          id:thread_id,
          entity_id: entity_id,
          status: thread_status,
          updated_at: updated_at,
          messages: sorted
        }
      })
      .addCase(sendUpdateThreadStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default threads.reducer

export const selectAllThreads = state => state.threads.threads
const selectThreadsByEntityId = (state, id) => id;

export const selectThreadById = (state, id) =>{
  return state.threads.threads.find(thread => thread.id === id);
}

export const selectLatestEntityThread = (state, id) =>{
  const threads = state.threads.threads.filter(thread => thread.entity_id === id);
  return threads[threads.length-1];
}

export const selectEntityThreads = createSelector([selectAllThreads, selectThreadsByEntityId], (threads, id)=>{
  const result =threads.filter(thread => thread.entity_id === id);
  return result;
})
