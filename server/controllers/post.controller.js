const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const { uploadErrors } = require('../utils/errors.utils');

const { promisify } = require('util');
const fs = require('fs'); // Permet d'incrémenter des éléments dans des fichiers
const pipeline = promisify(require('stream').pipeline);

// Récupère tous les post
exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data : ' + err);
    }).sort({ createAt: -1 }); // Les posts les plus récents apparaissent en premier
};

// Crée post
exports.createPost = async (req, res) => {
    // Pour l'image :
    let fileName;
    if (req.file !== null) {
        // Controle sur format et taille de l'img
        try {
            if (
                req.file.detectedMimeType !== 'image/jpg' &&
                req.file.detectedMimeType !== 'image/png' &&
                req.file.detectedMimeType !== 'image/jpeg'
            )
                // Throw = on passe directement au catch
                throw Error('invalid file');

            if (req.file.size > 500000) throw Error('max size');
        } catch (err) {
            const errors = uploadErrors(err);
            return res.status(201).send({ errors });
        }
        // Si pas d'erreur, on crée un nom de fichier unique
        fileName = req.body.posterId + Date.now() + '.jpg';

        // On crée le chemin de l'image
        await pipeline(
            req.file.stream,
            fs.createWriteStream(`${__dirname}/../../client/public/uploads/posts/${fileName}`)
        );
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? './uploads/posts/' + fileName : '',
        video: req.body.video,
        likers: [],
        comments: [],
    });

    // Save le post dans DB
    try {
        const post = await newPost.save(); // Ajout du post dans la DB
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.updatePost = (req, res) => {
    // si l'id passé en param n'est pas connu dans la DB, alors on s'arrête
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    const updatedRecord = {
        message: req.body.message,
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log('Update error : ' + err);
        }
    );
};

exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('Delete error : ' + err);
    });
};

// Aimer un post
exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        // Ajout de likes au post (on transmet l'id de la personne qui a liké)
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id },
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err);
            }
        );
        // Ajout de likes à l'utilisateur (post qu'il a aimé)
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id },
            },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

// Ne plus aimer un post
exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        // Ajout de likes au post (on transmet l'id de la personne qui a liké)
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id },
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err);
            }
        );
        // Ajout de likes à l'utilisateur (post qu'il a aimé)
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id },
            },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findById(
            req.params.id, // id du post
            (err, docs) => {
                // On parcourt nos commentaires dans docs.comments
                const theComment = docs.comments.find(
                    (comment) => comment._id.equals(req.body.commentId) // On veut que l'id du commentaire parcouru est égal au comment que l'on veut modifier
                );
                if (!theComment) return res.status(404).send('Comment not found');
                theComment.text = req.body.text; // Si on a trouvé le comment, il le modifie

                // On enregistre notre docs
                return docs.save((err) => {
                    if (!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
                });
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};
