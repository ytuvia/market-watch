import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit'
import axios from 'axios';
import awsExports from 'aws-exports';

const API_ENDPOINT = awsExports.aws_cloud_logic_custom[0].endpoint;

const initialState = {
  threads: [],
  status: 'idle',
  error: null
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
  const response = await axios.post(API_ENDPOINT + '/thread/messages', postData, {
    headers: {
      'Content-Type': 'application/json',
      
    },
  });
  return response.data;
}

export const sendRunAssistance = createAsyncThunk(
  'entity/thread/run',
  async initialEntity => {
    const result = await runAssistant(initialEntity.id, initialEntity.message);
    return result.data;
  }
)

const runAssistant = async (id, message) => {
  const postData = {
    'entity_id': id,
    'message': message
  }
  console.log(postData);
  const response = await axios.post(API_ENDPOINT + '/chat', postData, {
    headers: {
      'Content-Type': 'application/json',
      
    },
  });
  return response.data;
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
  console.log(postData);
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
        const id = action.meta.arg.id;
        const messages = action.payload;
        const sorted = messages.sort((a, b) => a.created_at - b.created_at);
        let thread = state.threads.find(item=>{return item.id === id})
        if(thread){
          thread = {
            id:id, 
            messages: sorted
          }
        }else{
          state.threads.push({
            id:id, 
            messages: sorted
          })
        }
      })
      .addCase(fetchEntityThreadMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(sendRunAssistance.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(sendRunAssistance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.meta.arg.id;
        const messages = action.payload;
        const sorted = messages.sort((a, b) => a.created_at - b.created_at);
        const threads = state.threads;
        let thread = threads.find(item=>{return item.id === id})
        if(thread){
          thread.messages = sorted;
        }else{
          state.threads.push({
            id:id, 
            messages: sorted
          })
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
  }
})

export default threads.reducer

export const selectAllThreads = state => state.threads.threads

export const selectThreadById = (state, id) =>{
  return state.threads.threads.find(thread => thread.id === id);
}
  
