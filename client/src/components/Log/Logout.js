import React from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

const Logout = () => {
    const removeCookie = (key) => {
        // Si il se passe quelque chose sur la fenêtre
        if (window !== 'undefined') {
            cookie.remove(key, { expires: 1 });
        }
    };

    const logout = async () => {
        // On retire le cookie en back
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true,
        })
            // Et en front
            .then(() => removeCookie('jwt'))
            .catch((err) => console.log(err));

        // Rafraichis page pour refaire un checkUser. Sinon on reste avec la nabvar comme si on était co
        window.location = '/';
    };

    return (
        <li onClick={logout}>
            <img src="./img/icons/logout.svg" alt="logout" />
        </li>
    );
};

export default Logout;
