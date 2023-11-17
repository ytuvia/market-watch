// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import entities from './entities/entitiesSlice';
import threads from './threads/threadsSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, entities, threads });

export default reducers;
