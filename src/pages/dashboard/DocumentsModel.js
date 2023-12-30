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
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';
import { getUrl } from 'aws-amplify/storage';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDocumentsPage, selectEntityDocuments, deleteDocument } from 'store/reducers/entities/entitiesSlice';

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

const DownloadButton =  ({filename}) => {
  filename = filename.replace(/^public\//, '');
  const [isDisabled, setIsDisabled] = useState(false);
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

  const handleDownload = async () => {
    setIsDisabled(true);
    console.log(filename);

    const result = await getUrl({key:filename, options: { expiresIn: 60 }});
    fetch(result)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setIsDisabled(false);
    })
    .catch(error => console.error('Error downloading file:', error))
    //console.log(result);
    //downloadBlob(result.Body, filename);
    
  };

  return (
    <IconButton edge="end" aria-label="comments" onClick={handleDownload} disabled={isDisabled}>
      <DownloadIcon />
    </IconButton>
  )
}

const DeleteButton = ({id}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    await dispatch(deleteDocument({id: id}));
    setIsLoading(false);
  }
  return (
      <IconButton edge="end" aria-label="comments" onClick={handleDelete} disabled={isLoading}>
        <DeleteIcon />
      </IconButton>
  )
}

const DocumentsModal = ({entityId, name}) => {
    const dispatch = useDispatch();
    const [nextToken, setNextToken] = useState(null);
    const [open, setOpen] = useState(false);
    const documents = useSelector(state=>selectEntityDocuments(state, entityId));
    const handleOpen = async () => {
      const result = await dispatch(
        fetchDocumentsPage({ 
          id: entityId,
          nextToken: nextToken
        })
      ).unwrap();
      setNextToken(result.nextToken);
      setOpen(true);
    }
    const handleClose = () => setOpen(false);
    
    return (
        <div>
          <IconButton aria-label="documents" onClick={handleOpen}>
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
                    Documents of {name}
                </Typography>
                <Paper style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                <List sx={{ width: '100%' }}>
                  {documents?.map(item => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing="1">
                          <DownloadButton filename={item.filename} /><DeleteButton id={item.id} />
                        </Stack>
                      }
                      disablePadding
                    >
                      <ListItemButton role={undefined} dense>
                        <ListItemText id={item.id} primary={item.filename} />
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

export default DocumentsModal;

