// material-ui
import {
  Typography,
  IconButton,
  Modal,
  Box,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreadsPage, selectEntityThreads, fetchThreadMessages } from 'store/reducers/threads/threadsSlice';
import { format } from 'date-fns';
import { openChat } from 'store/reducers/chat';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

const ThreadsModal = ({entity_id, name}) => {
  const dispatch = useDispatch();
  const [nextToken, setNextToken] = useState(null);
  const [open, setOpen] = useState(false);
  const threads = useSelector(state=>selectEntityThreads(state, entity_id));
  const threadsStatus = useSelector(state => state.threads.status);

  const handleOpen = async () => {
    const result = await dispatch(
      fetchThreadsPage({ 
        id: entity_id,
        nextToken: nextToken
      })
    ).unwrap();
    setNextToken(result.nextToken);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const handleOpenThread = async (thread_id) => {
    /*await dispatch(fetchThreadMessages({id: thread_id}))
    await dispatch(openChat({
      is_open: true,
      entity_id: entity_id,
      thread_id: thread_id
    }));*/
  }
  return (
      <div>
        <IconButton aria-label="threads" onClick={handleOpen}>
          <ArticleIcon />
        </IconButton>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Stack spacing={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                  Threads of {name}
              </Typography>
              <Paper style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
              <List sx={{ width: '100%' }}>
                {threads?.map(item => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing="2">
                        <Typography id="item-title" variant="p" component="span">{item.title}</Typography>
                        <Typography id="item-updated" variant="p" component="span">{item.updatedAt ? format(new Date(item.updatedAt), "yyyy-MM-dd HH:mm:ss"): ''}</Typography>
                      </Stack>
                    }
                    disablePadding
                  >
                    <ListItemButton role={undefined} dense onClick={handleOpenThread(item.id)}>
                      <ListItemText id={item.id} primary="open" />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              </Paper>
            </Stack>
          </Box>
        </Modal>
      </div>
    );
}

export default ThreadsModal;

