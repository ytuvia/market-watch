// material-ui
 import {
  Stack,
  Grid } from '@mui/material';
import AddModal from './AddModal';
import DashboardCard from './DashboardCard';

// api import
import { API, graphqlOperation } from 'aws-amplify';
import { listEntities } from 'graphql/queries';
import { onCreateEntity, onDeleteEntity } from 'graphql/subscriptions';
import { useCallback, useState, useEffect } from 'react';

const DashboardDefault = () => {
  const [entities, setEntities] = useState([]);

  API.graphql(
    graphqlOperation(onCreateEntity)
  ).subscribe({
    next: () => {
      loadEntities();
    },
    error: (error) => console.warn(error)
  });

  API.graphql(
    graphqlOperation(onDeleteEntity)
  ).subscribe({
    next: () => {
      loadEntities();
    },
    error: (error) => console.warn(error)
  });

  const loadEntities = useCallback(async () => {
    const result = await API.graphql(graphqlOperation(listEntities));
    const entities = result.data.listEntities.items;
    setEntities(entities);
  }, []);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  return (
    <Stack spacing={2}>
      <AddModal/>
      <Grid container spacing={2}>
        {entities?.map(entity => (
          <Grid item xs={12} sm={5} md={3} key={entity.id}>
            <DashboardCard key={entity.id} id={entity.id}></DashboardCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
)};

export default DashboardDefault;
