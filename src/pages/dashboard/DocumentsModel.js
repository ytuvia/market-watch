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
import TokenIcon from '@mui/icons-material/Token';

import { API, graphqlOperation } from 'aws-amplify';
import { countTokens } from 'graphql/queries'
import { useState } from 'react';
import { Storage } from 'aws-amplify';

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
    const result = await Storage.get(filename, { download: true });
    downloadBlob(result.Body, filename);
    setIsDisabled(false);
  };

  return (
    <IconButton edge="end" aria-label="comments" onClick={handleDownload} disabled={isDisabled}>
      <DownloadIcon />
    </IconButton>
  )
}

const TokensButton =  ({id}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  const handleCount = async () => {
    setIsDisabled(true);
    const result = await API.graphql(graphqlOperation(countTokens, {
      'id': id
    }));
    setTokenCount(result.data.countTokens)
    setIsDisabled(false);
    setIsHidden(true);
  };

  return (
    <Stack direction="row">
      <div hidden={isHidden==true}>
        <IconButton edge="end" aria-label="comments" onClick={handleCount} disabled={isDisabled}>
          <TokenIcon />
        </IconButton>
      </div>
      <div hidden={isHidden==false}>
        <Typography id="modal-modal-title" variant="caption" component="p">{tokenCount}</Typography>
      </div>
    </Stack>
  )
}

const DocumentsModal = ({entityId, documents, name}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
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
                          <DownloadButton filename={`${entityId}/${item.filename}`} /><TokensButton id={item.id} />
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
