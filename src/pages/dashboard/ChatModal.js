// material-ui
import {
    Box,
    Modal,
} from '@mui/material';
import Chat from 'components/Chat'
import { useDispatch, useSelector } from 'react-redux';
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

const ChatModal = () => {
    const { is_open, entity_id, thread_id } = useSelector((state) => state.chat);

    const dispatch = useDispatch();
    const handleClose = async () => {
      dispatch(openChat({
        is_open: false,
        entity_id: entity_id,
        thread_id: thread_id
      }))
    }

    return (
        <Modal
          open={is_open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Chat entity_id={entity_id} thread_id={thread_id}/>
          </Box>
        </Modal>
    );
  }

export default ChatModal;