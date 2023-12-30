import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from 'react-redux'
import { selectLatestEntityThread, sendRunAssistance, sendClearThread, fetchEntityThreadMessages } from 'store/reducers/threads/threadsSlice';
import { selectEntityById } from 'store/reducers/entities/entitiesSlice';
import Markdown from 'react-markdown';


const Chat = ({id}) => {
    const paperRef = useRef(null);
    const dispatch = useDispatch();
    const entity = useSelector(state=>{
      return selectEntityById(state, id)
    });
    const thread = useSelector(state=>{
      return selectLatestEntityThread(state, id)
    });
    const [input, setInput] = React.useState("");
    const [requestStatus, setRequestStatus] = useState('idle');

    const handleSend = async () => {
        if (input.trim() !== "") {
          setRequestStatus('in-progress');
          await dispatch(sendRunAssistance({
            entity_id: id,
            thread_id: thread.id,
            message: input
          }));
          scrollToBottom();
          setInput("");
          setRequestStatus('idle');
        }
    };

    const handleInputChange = (event) => {
      setInput(event.target.value);
    };

    const handleClear = async () => {
      setRequestStatus('in-progress');
      await dispatch(sendClearThread({
        entity_id: id
      }));

      await dispatch(fetchEntityThreadMessages({ 
        id: id,
      }))
      setRequestStatus('idle');
    };

    const scrollToBottom = () => {
      if (paperRef.current) {
        paperRef.current.scrollTop = paperRef.current.scrollHeight;
      }
    };

    const handleKeyPress = async (event) => {
      if (event.key === 'Enter') {
        await handleSend();
      }
    };

    useEffect(() => {
      scrollToBottom();
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [thread]);



  return (
    <Stack>
      <Typography variant="h3">{entity.name} chat</Typography>
      <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
        <Box ref={paperRef} sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
          {thread?.messages?.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div hidden={!['queued', 'in_progress','requires_action', 'cancelling'].includes(thread.status)}>
          <LinearProgress variant="indeterminate" />
          </div>
        </Box>
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                placeholder="Type a message"
                value={input}
                onChange={handleInputChange}
                disabled={requestStatus!=='idle'}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item xs={2}>
              <Stack direction="row">
                <Button
                  fullWidth
                  size="large"
                  color="primary"
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSend}
                  disabled={requestStatus!=='idle'}
                >
                  Send
                </Button>
                <IconButton
                  color="error"
                  variant="contained"
                  onClick={handleClear}
                  disabled={requestStatus!=='idle'}
                >
                  {requestStatus!=='idle' ? (
                    // CircularProgress is only rendered when 'loading' is true
                    <CircularProgress />
                  ) : ' '}
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Stack>
    
  );
};

const Message = ({ message }) => {
  const isBot = message.role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          backgroundColor: isBot ? "primary.light" : "secondary.light",
        }}
      >
        <Stack>
          <Typography variant="caption">{isBot ? 'Assistant' : 'You'}</Typography>
          {message?.content?.map((item, index) => (
            <Markdown key={index}>{item.text.value}</Markdown>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Chat;