import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import usersReducer from './users.reducer';
import postReducer from './post.reducer';

// Regroupe tout nos reducers
export default combineReducers({
    userReducer,
    usersReducer,
    postReducer,
});
