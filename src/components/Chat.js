import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  Stack
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from 'react-redux'
import { selectThreadById, sendRunAssistance, sendClearThread, fetchEntityThreadMessages } from 'store/reducers/threads/threadsSlice';

const Chat = ({id}) => {
    const paperRef = useRef(null);
    const dispatch = useDispatch();
    const thread = useSelector(state=>{
      return selectThreadById(state, id)
    });
    const [input, setInput] = React.useState("");
    const [requestStatus, setRequestStatus] = useState('idle');

    const handleSend = async () => {
        if (input.trim() !== "") {
          setRequestStatus('in-progress');
          await dispatch(sendRunAssistance({
            id: id, 
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
        id: id
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

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box ref={paperRef} sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {thread?.messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
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
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
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
        {message?.content?.map((item, index) => (
          <Typography key={index} variant="body1">{item.text.value}</Typography>
        ))}
      </Paper>
    </Box>
  );
};

export default Chat;