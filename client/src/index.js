import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers';

// dev tools
// import { composeWithDevTools } from 'redux-devtools-extension';
// import logger from 'redux-logger';
import { getUsers } from './redux/actions/users.actions';
import { getPosts } from './redux/actions/post.actions';

const store = createStore(rootReducer, applyMiddleware(thunk));

// On récupère tout les utilisateurs au lancement de l'application
store.dispatch(getUsers());
store.dispatch(getPosts());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
