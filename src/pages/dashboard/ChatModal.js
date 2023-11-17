// material-ui
import {
    Button,
    Box,
    Modal,
    CircularProgress
} from '@mui/material';
import Chat from 'components/Chat'
// api import
import { useState} from 'react';
import { useDispatch } from 'react-redux';
import { fetchEntityThreadMessages } from 'store/reducers/threads/threadsSlice';

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

const ChatModal = ({id}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => setOpen(false);

    const handleOpen = async () => {
      setIsLoading(true);
      await dispatch(fetchEntityThreadMessages({ 
        id: id,
      }))
      setIsLoading(false);
      setOpen(true);
    }
    return (
      <div>
         {isLoading ? (
          // CircularProgress is only rendered when 'loading' is true
          <CircularProgress />
        ) : (
          // Your main content goes here
          <div>
            <Button size="small" hidden={isLoading} onClick={handleOpen}>chat</Button>
          </div>
        )}
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Chat id={id} />
          </Box>
        </Modal>
      </div>
    );
  }

export default ChatModal;