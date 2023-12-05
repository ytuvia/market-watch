// material-ui
import { 
    Typography, 
    Button,
    Box,
    Modal,
    Stack,
    TextField,
    Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// api import
import { useState} from 'react';
import { useDispatch } from 'react-redux';
import { addEntity } from 'store/reducers/entities/entitiesSlice';

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

const AddModal = () => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [entityName, setEntityName] = useState(false);
  
    const handleChange = (e) => {
      setEntityName(e.target.value)
    };
  
    const handleAdd = async () => {
      setIsDisabled(true);
      await dispatch(addEntity({ name: entityName }))
      setIsDisabled(false);
      handleClose();
    }
  
    return (
      <Box>
        <Fab color="primary" aria-label="add" onClick={handleOpen}>
          <AddIcon />
        </Fab>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Stack spacing={2}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Add new entity
              </Typography>
              <TextField id="outlined-search" label="Entity name" type="search" disabled={isDisabled} onChange={handleChange}/>
              <Button onClick={handleAdd} disabled={isDisabled} component="label" variant="contained">Add</Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    )
  }

export default AddModal;