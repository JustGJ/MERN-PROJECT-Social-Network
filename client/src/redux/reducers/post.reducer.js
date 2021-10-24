import { GET_POST, LIKE_POST, UNLIKE_POST } from '../actions/post.actions';

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POST:
            return action.payload;
        case LIKE_POST:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        likers: [action.payload.userId, ...post.likers],
                    };
                }
                return post;
            });
        case UNLIKE_POST:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        likers: post.likers.filter((id) => id !== action.payload.userId),
                    };
                }
                return post;
            });
        default:
            return state;
    }
}
