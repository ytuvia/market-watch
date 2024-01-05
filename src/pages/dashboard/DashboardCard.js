// material-ui
import { 
    Typography, 
    CardContent, 
    CardActions,
    Stack,
    Button } from '@mui/material';
import DeleteButton from './DeleteButton';
import ThreadsModal from './ThreadsModal';
import UploadModal from './UploadModal';
import DocumentsModal from './DocumentsModel';
import { useSelector } from 'react-redux';
import { selectEntityById } from 'store/reducers/entities/entitiesSlice';
import { fetchEntityThreadMessages } from 'store/reducers/threads/threadsSlice';
import MainCard from 'components/MainCard';
import { dispatch } from 'store/index';
import { openChat } from 'store/reducers/chat';

const DashboardCard = ({id}) =>{
    const entity = useSelector(state=> selectEntityById(state, id))
    const handleChat = async () => {
      const result = await dispatch(fetchEntityThreadMessages({ 
        id: id,
      })).unwrap();
      await dispatch(openChat({
        is_open: true,
        entity_id: id,
        thread_id: result.thread_id
      }));
    }

    return (
      <MainCard key={entity.id}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">
              {entity.name}
            </Typography>
            <DeleteButton id={entity.id} name={entity.name}/>
          </Stack>
          <Stack>
            <Typography variant="subtitle">
                <Stack direction="row" alignItems="center">
                    { entity.threadsCount } threads
                </Stack>
            </Typography>
            <Typography variant="subtitle">
                <Stack direction="row" alignItems="center">
                    <DocumentsModal entityId={entity.id} documents={entity.documents?.items} name={ entity.name } />
                    { entity.documentCount } documents
                </Stack>
            </Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <UploadModal id={entity.id} name={entity.name}></UploadModal>
          <Button size="small" onClick={handleChat}>chat</Button>
        </CardActions>
      </MainCard>
    )
  }

  export default DashboardCard;