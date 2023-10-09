// material-ui
import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    IconButton,
    Modal,
    Box,
    Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';

// api import
import { useState } from 'react';

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

const AnswersModal = ({answers, name}) => {
    //const [answers, setAnswers] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
          <IconButton aria-label="answers" onClick={handleOpen}>
            <ChatIcon />
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
                    Saved answers for {name}
                </Typography>
                {answers?.map(item => (
                    <Accordion key={item.id}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography>{item.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                            {item.answer}
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
              </Stack>
            </Box>
          </Modal>
        </div>
      );
}

export default AnswersModal;

