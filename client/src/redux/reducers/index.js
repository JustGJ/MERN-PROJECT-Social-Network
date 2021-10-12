import { combineReducers } from 'redux';
import userReducer from './user.reducer';

// Regroupe tout nos reducers
export default combineReducers({
    userReducer,
});
