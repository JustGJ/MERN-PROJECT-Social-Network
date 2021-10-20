import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBio } from '../../redux/actions/user.actions';
import LeftNav from '../LeftNav';
import { dateParser } from '../Utils';
import FollowHandler from './FollowHandler';
import UploadImg from './UploadImg';

const UpdateProfil = () => {
    const [bio, setBio] = useState('');
    const [updateForm, setUpdateForm] = useState(false);
    const userData = useSelector((state) => state.userReducer);
    const usersData = useSelector((state) => state.usersReducer);
    const [followingPopup, setFollowingPopup] = useState(false); // Abonnements
    const [followersPopup, setFollowersPopup] = useState(false); // Abonnés
    const dispatch = useDispatch();

    const handleUpdate = () => {
        dispatch(updateBio(userData._id, bio));
        setUpdateForm(false);
    };

    return (
        <div className="profil-container">
            <LeftNav />
            <h1>Profil de {userData.pseudo}</h1>
            <div className="update-container">
                <div className="left-part">
                    <h3>Photo de profil</h3>
                    <img src={userData.picture} alt="user-pic" />
                    <UploadImg />
                </div>
                <div className="right-part">
                    <div className="bio-update">
                        <h3>Bio</h3>
                        {updateForm === false && (
                            <>
                                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                                <button onClick={() => setUpdateForm(!updateForm)}>
                                    Modifier bio
                                </button>
                            </>
                        )}
                        {/* Formulaire area */}
                        {updateForm && (
                            <>
                                <textarea
                                    type="text"
                                    defaultValue={userData.bio}
                                    onChange={(e) => setBio(e.target.value)}></textarea>
                                <button onClick={handleUpdate}>Valider modifications</button>
                            </>
                        )}
                    </div>
                    <h4>Membre depuis le : {dateParser(userData.createdAt)}</h4>
                    <h5 onClick={() => setFollowingPopup(true)}>
                        Abonnements : {userData.following ? userData.following.length : ''}
                    </h5>
                    <h5 onClick={() => setFollowersPopup(true)}>
                        Abonnés : {userData.followers ? userData.followers.length : ''}
                    </h5>
                </div>
            </div>
            {/* // Popup abonnements */}
            {followingPopup && (
                <div className="popup-profil-container">
                    <div className="modal">
                        <h3>Abonnements</h3>
                        <span className="cross" onClick={() => setFollowingPopup(false)}>
                            &#10005;
                        </span>
                        <ul>
                            {usersData.map((user) => {
                                for (let i = 0; i < userData.following.length; i++) {
                                    // On vérifie si l'user parcouru apparait dans le tableau des abonnements du user
                                    if (user._id === userData.following[i]) {
                                        return (
                                            <li key={user._id}>
                                                <img src={user.picture} alt="user-pic" />
                                                <h4>{user.pseudo}</h4>
                                                <div className="follow-handler">
                                                    <FollowHandler
                                                        idToFollow={user._id}
                                                        type="suggestion"
                                                    />
                                                </div>
                                            </li>
                                        );
                                    }
                                }
                            })}
                        </ul>
                    </div>
                </div>
            )}
            {/* // Popup abonnés */}
            {followersPopup && (
                <div className="popup-profil-container">
                    <div className="modal">
                        <h3>Abonnés</h3>
                        <span className="cross" onClick={() => setFollowersPopup(false)}>
                            &#10005;
                        </span>
                        <ul>
                            {usersData.map((user) => {
                                for (let i = 0; i < userData.followers.length; i++) {
                                    // On vérifie si l'user parcouru apparait dans le tableau des abonnements du user
                                    if (user._id === userData.followers[i]) {
                                        return (
                                            <li key={user._id}>
                                                <img src={user.picture} alt="user-pic" />
                                                <h4>{user.pseudo}</h4>
                                                <div className="follow-handler">
                                                    <FollowHandler
                                                        idToFollow={user._id}
                                                        type="suggestion"
                                                    />
                                                </div>
                                            </li>
                                        );
                                    }
                                }
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateProfil;
