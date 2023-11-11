// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import entities from './entities/entitiesSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, entities });

export default reducers;
