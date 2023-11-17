// material-ui
 import {
  Stack,
  Grid, 
  Box,
  LinearProgress } from '@mui/material';
import AddModal from './AddModal';
import DashboardCard from './DashboardCard';

// api import
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { selectAllEntities, fetchEntities } from 'store/reducers/entities/entitiesSlice';

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const entities = useSelector(selectAllEntities);
  const entitiesStatus = useSelector(state => state.entities.status);
  
  useEffect(() => {
    if (entitiesStatus === 'idle') {
      dispatch(fetchEntities());
    }
  }, [entitiesStatus, dispatch])

  return (
    <Box>
      { entitiesStatus=="loading" ? 
        <Box sx={{
          width: '100%',  // Set width to 100%
          alignItems: 'center', // Center content vertically
          justifyContent: 'center', // Center content horizontally
        }}>
          <LinearProgress />
        </Box> : ''
      }
      <Stack spacing={2}>
        { entitiesStatus!="loading" ? 
        <AddModal/> : ''
        }
        <Grid container spacing={2}>
          {entities?.map(entity => (
            <Grid item xs={12} sm={5} md={3} key={entity.id}>
              <DashboardCard key={entity.id} id={entity.id}></DashboardCard>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
)};

export default DashboardDefault;
