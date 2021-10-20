import axios from 'axios';

// Posts
export const GET_POST = 'GET_POSTS';

export const getPosts = () => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/post`)
            .then((res) => {
                dispatch({ type: GET_POST, payload: res.data });
            })
            .catch((err) => console.log(err));
    };
};
