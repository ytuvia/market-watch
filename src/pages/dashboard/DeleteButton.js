// material-ui
import { 
    Typography, 
    Button,
    IconButton,
    Box,
    Modal,
    Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { removeEntity } from 'graphql/mutations'

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

const DeleteButton = ({ id, name }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleRemove = async () => {
        setIsDisabled(true);
        await API.graphql(graphqlOperation(removeEntity, {
        'args':{
            'id': id
        }
        }));
        setIsDisabled(false);
        handleClose();
    }

    return (
        <Box>
            <IconButton aria-label="delete" onClick={handleOpen} color="error">
                <DeleteIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={handleRemove}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                <Stack spacing={2}>
                    <Typography id="modal-modal-title" variant="h4" component="h2">
                    Remove entity {name}
                    </Typography>
                    <Typography id="modal-modal-title" variant="body1" component="p">
                    Are you sure you want to remove {name} and all its data?
                    </Typography>
                    <Button onClick={handleRemove} disabled={isDisabled} component="label" variant="contained" color="error">Remove</Button>
                </Stack>
                </Box>
            </Modal>
        </Box>
    )
}

export default DeleteButton;