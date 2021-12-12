import { GET_ALL_POST } from '../actions/post.actions';

const initialState = {};

export default function allPostsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_POST:
            return action.payload;
        default:
            return state;
    }
}
