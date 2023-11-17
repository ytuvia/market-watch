// material-ui
import { 
    Typography, 
    CardContent, 
    CardActions,
    Stack } from '@mui/material';
import DeleteButton from './DeleteButton';
import AskModal from './AskModal';
import ChatModal from './ChatModal';
import UploadModal from './UploadModal';
import AnswersModal from './AnswersModal';
import DocumentsModal from './DocumentsModel';
import { useSelector } from 'react-redux';
import { selectEntityById } from 'store/reducers/entities/entitiesSlice';

// project import
import MainCard from 'components/MainCard';

const DashboardCard = ({id}) =>{
    const entity = useSelector(state=> selectEntityById(state, id))
  
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
                    <AnswersModal id={entity.id} name={ entity.name }/>
                    { entity.answerCount } answers
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
          <ChatModal id={entity.id}></ChatModal>
        </CardActions>
      </MainCard>
    )
  }

  export default DashboardCard;