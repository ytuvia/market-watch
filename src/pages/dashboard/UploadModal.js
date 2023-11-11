// material-ui
import { 
    Typography, 
    Button,
    Box,
    Modal,
    Stack,
    styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
  
// api import
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadDocument } from '../../store/reducers/entities/entitiesSlice';

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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const UploadModal = ({id, name}) => {
    const dispatch = useDispatch();
    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [addRequestStatus, setAddRequestStatus] = useState('idle');
  
    const [isDisabled, setIsDisabled] = useState(false);
  
    const onChange = async (e) => {
      setAddRequestStatus('pending');
      setIsDisabled(true);
      await dispatch(uploadDocument({ id: id, file: e.target.files[0] })).unwrap();
      setAddRequestStatus('idle');
      setIsDisabled(false);
      setOpen(false);
    }
  
    return (
      <div>
        <Button size="small" onClick={handleOpen}>upload</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Stack spacing={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Upload document
              </Typography>
              <Typography id="modal-modal-description" variant="body1" component="p">
                Choose a file to upload into { name }
              </Typography>
  
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} disabled={isDisabled}>
                Upload file
                <VisuallyHiddenInput type="file" onChange={onChange} />
              </Button>
              <Button onClick={handleClose} disabled={isDisabled} component="label" variant="contained" color="secondary">Close</Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    );
  }

export default UploadModal;