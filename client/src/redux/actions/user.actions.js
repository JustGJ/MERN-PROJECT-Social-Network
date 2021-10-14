import axios from 'axios';

export const GET_USER = 'GET_USER';
export const UPLOAD_PICTURE = 'UPLOAD_PICTURE';
export const UPDATE_BIO = 'UPDATE_BIO';
export const FOLLOW_USER = 'FOLLOW_USER';
export const UNFOLLOW_USER = 'UNFOLLOW_USER';

// Récupère un USER
export const getUser = (uid) => {
    // Dispatch = ce qu'on envoie au reducer
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
            .then((res) => {
                dispatch({ type: GET_USER, payload: res.data });
            })
            .catch((err) => console.log(err));
    };
};

// Changement image
export const uploadPicture = (data, id) => {
    return (dispatch) => {
        // Envoie à la DB, crée un fichier dans public/uploads/profil/....
        return axios
            .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data)
            .then((res) => {
                return (
                    axios
                        // On averti le store pour changer l'image en conséquence (on récupère ce qu'on a ajouter à la DB)
                        .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
                        .then((res) => {
                            // Changement de l'image dans le store
                            dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
                        })
                );
            })
            .catch((err) => console.log(err));
    };
};

// Update bio
export const updateBio = (userId, bio) => {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: `${process.env.REACT_APP_API_URL}api/user/${userId}`,
            data: { bio },
        })
            .then((res) => {
                dispatch({ type: UPDATE_BIO, payload: bio });
            })
            .catch((err) => console.log(err));
    };
};

export const followUser = (followerId, idToFollow) => {
    return (dispatch) => {
        return axios({
            method: 'patch',
            url: `${process.env.REACT_APP_API_URL}api/user/follow/` + followerId,
            data: { idToFollow },
        })
            .then((res) => {
                dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
            })
            .catch((err) => console.log(err));
    };
};

export const unFollowUser = (followerId, idToUnfollow) => {
    return (dispatch) => {
        return axios({
            method: 'patch',
            url: `${process.env.REACT_APP_API_URL}api/user/unfollow/` + followerId,
            data: { idToUnfollow },
        })
            .then((res) => {
                dispatch({ type: UNFOLLOW_USER, payload: { idToUnfollow } });
            })
            .catch((err) => console.log(err));
    };
};
