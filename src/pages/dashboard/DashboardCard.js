// material-ui
import { 
    Typography, 
    CardContent, 
    CardActions,
    Stack } from '@mui/material';
import DeleteButton from './DeleteButton';
import AskModal from './AskModal';
import UploadModal from './UploadModal';
import AnswersModal from './AnswersModal';
import DocumentsModal from './DocumentsModel';

// project import
import MainCard from 'components/MainCard';

// api import
import { API, graphqlOperation } from 'aws-amplify';
import { getEntity } from 'graphql/queries';
import { onCreateDocument, onCreateAnswer } from 'graphql/subscriptions';
import { useCallback, useState, useEffect } from 'react';

const DashboardCard = ({id}) =>{
    const [entity, setEntity] = useState([]);
    API.graphql(
      graphqlOperation(onCreateDocument)
    ).subscribe({
      next: () => {
        loadEntity(id);
      },
      error: (error) => console.warn(error)
    });
  
    API.graphql(
      graphqlOperation(onCreateAnswer)
    ).subscribe({
      next: () => {
        loadEntity(id);
      },
      error: (error) => console.warn(error)
    });
  
    const loadEntity = useCallback(async (id) => {
      const result = await API.graphql(graphqlOperation(getEntity, {
        'id': id,
      }));
      const entity = result.data.getEntity;
      setEntity(entity);
    }, []);
  
    useEffect(() => {
      loadEntity(id);
    }, [loadEntity]);
  
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
                    <AnswersModal answers={entity.answers?.items} name={ entity.name }/>
                    {entity.answers?.items.length} answers
                </Stack>
            </Typography>
            <Typography variant="subtitle">
                <Stack direction="row" alignItems="center">
                    <DocumentsModal entityId={entity.id} documents={entity.documents?.items} name={ entity.name } />
                    {entity.documents?.items.length} documents
                </Stack>
            </Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <UploadModal id={entity.id} name={entity.name}></UploadModal>
          <AskModal id={entity.id} name={entity.name}></AskModal>
        </CardActions>
      </MainCard>
    )
  }

  export default DashboardCard;