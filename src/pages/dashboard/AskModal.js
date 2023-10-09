// material-ui
import { 
    Typography, 
    Button,
    Box,
    Modal,
    Stack,
    TextField
} from '@mui/material';

// api import
import { API, graphqlOperation } from 'aws-amplify';
import { createAnswer } from 'graphql/mutations'
import { useState} from 'react';
import axios from 'axios';
import awsExports from 'aws-exports';

const API_ENDPOINT = awsExports.aws_cloud_logic_custom[0].endpoint;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };

const AskModal = ({id, name}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hidden, setHidden] = useState(true);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isSaved, setIsSaved] = useState(false);
  
    const handleOnClick = async () => {
      setIsDisabled(true);
      const postData = {
        'entity_id': id,
        'question': question
      }
      const response = await axios.post(API_ENDPOINT + '/ask', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAnswer(response.data);
      setIsDisabled(false);
      setHidden(false)
    }
  
    const handleChange = (e) => {
      setQuestion(e.target.value)
    };
  
    const handleSave = async () => {
      setIsDisabled(true);
      setIsSaved(true);
      await API.graphql(graphqlOperation(createAnswer, {
        'input': {
          'question': question,
          'answer': answer,
          'entityAnswersId': id
        }
      }));
      setIsDisabled(false);
      setHidden(true);
      setIsSaved(false);
      handleClose();
    }
  
    const textBoxLabel = "Ask a question about " + name;
    return (
      <div>
        <Button size="small" onClick={handleOpen}>ask</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Stack spacing={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Ask
              </Typography>
              <TextField id="outlined-search" label={textBoxLabel} type="search" disabled={isDisabled} onChange={handleChange}/>
              <Button onClick={handleOnClick} disabled={isDisabled} component="label" variant="contained">Ask</Button>
              <Box hidden={hidden}>
                <Stack spacing={1}>
                <Typography id="modal-modal-answer" variant="body1" component="p">{ answer }</Typography>
                <Button onClick={handleSave} disabled={isSaved} component="label" variant="contained" color="success" size="small">Save</Button>
                </Stack>
              </Box>
              <Button onClick={handleClose} disabled={isDisabled} component="label" variant="contained" color="secondary">Close</Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    );
  }

export default AskModal;