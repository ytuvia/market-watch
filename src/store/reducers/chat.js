// types
import { createSlice } from '@reduxjs/toolkit';
import { Newspaper } from '../../../node_modules/@mui/icons-material/index';

// initial state
const initialState = {
  is_open: false,
  entity_id: null,
  thread_id: null,
};

// ==============================|| SLICE - CHAT ||============================== //

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat(state, action) {
      const newState = action.payload;
      state.is_open = newState.is_open;
      state.entity_id = newState.entity_id;
      state.thread_id = newState.thread_id;
    },
  }
});

export default chat.reducer;

export const { openChat } = chat.actions;
