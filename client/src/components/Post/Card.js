import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FollowHandler from '../Profil/FollowHandler';
import { dateParser, isEmpty } from '../Utils';

const Card = ({ post }) => {
    const [isLoading, setIsLoading] = useState(true);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.usersReducer);

    useEffect(() => {
        !isEmpty(usersData[0]) && setIsLoading(false);
    }, [usersData]);

    return (
        <li key={post._id} className="card-container">
            {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
                <>
                    {/* AFFICHAGE PHOTO DE PROFIL DU USER AYANT POST */}
                    <div className="card-left">
                        <img
                            src={
                                !isEmpty(usersData[0]) &&
                                usersData
                                    .map((user) => {
                                        // Si l'user parcouru a posté un post, alors on return sa picture
                                        if (user._id === post.posterId) return user.picture;
                                    })
                                    // Pour retirer toutes les virgules
                                    .join('')
                            }
                            alt="poster-pic"
                        />
                    </div>
                    {/* AFFICHAGE PSEUDO DU USER AYANT POST */}
                    <div className="card-right">
                        <div className="card-header">
                            <div className="pseudo">
                                <h3>
                                    {!isEmpty(usersData[0]) &&
                                        usersData.map((user) => {
                                            // Si l'user parcouru a posté un post, alors on return son pseudo
                                            if (user._id === post.posterId) return user.pseudo;
                                        })}
                                </h3>
                                {post.posterId !== userData._id && (
                                    <FollowHandler idToFollow={post.posterId} type="card" />
                                )}
                            </div>
                            <span>{dateParser(post.createdAt)}</span>
                        </div>
                        <p>{post.message}</p>
                        {post.picture && (
                            <img src={post.picture} alt="card-pic" className="card-pic" />
                        )}
                        {post.video && (
                            <iframe
                                width="500"
                                height="300"
                                src={post.video}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={post._id}></iframe>
                        )}
                    </div>
                    <div className="card-footer">
                        <div className="comment-icon">
                            <img src="./img/icons/message1.svg" alt="comment" />
                            <span>{post.comments.length}</span>
                        </div>
                        <h6>Like button</h6>
                        <img src="./img.icons/share.svg" alt="share" />
                    </div>
                </>
            )}
        </li>
    );
};

export default Card;
