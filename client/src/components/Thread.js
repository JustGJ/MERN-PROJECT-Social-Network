import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/actions/post.actions';
import Card from './Post/Card';
import { isEmpty } from './Utils';

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const [count, setCount] = useState(5); // infinite scroll
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.postReducer);

    const loadMore = () => {
        // Taille total fenetre hauteur + endroit du scroll actuel      valeur totale du scroll
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >
            document.scrollingElement.scrollHeight
        ) {
            setLoadPost(true);
        }
    };

    useEffect(() => {
        if (loadPost) {
            dispatch(getPosts(count));
            setLoadPost(false);
            setCount(count + 5);
        }
        window.addEventListener('scroll', loadMore);
        return () => window.removeEventListener('scroll', loadMore);
    }, [loadPost, dispatch, count]);

    return (
        <div className="thread-container">
            <ul>
                {!isEmpty(posts[0]) &&
                    posts.map((post) => {
                        return <Card key={post._id} post={post} />;
                    })}
            </ul>
        </div>
    );
};

export default Thread;
