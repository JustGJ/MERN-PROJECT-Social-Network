const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

// RECUPERE TOUS LES USERS
exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password'); // On récupère tout les users, et séléctionne tout, sauf le password des users
    res.status(200).json(users); // Si succès, affiche users en json
};

// RECUPERE UN USER
exports.userInfo = async (req, res) => {
    // si l'id passé en param n'est pas connu dans la DB, alors on s'arrête
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknow : ' + req.params.id);

    // Sinon on recupere l'id en params, et on affiche l'user
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknow : ' + err);
    }).select('-password');
};

// MODIFIE UN USER
exports.updateUser = async (req, res) => {
    const filter = { _id: req.params.id }; // Ce qu'on veut filtrer
    const update = { $set: { bio: req.body.bio } }; // Ce qu'on veut mettre à jour

    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknow : ' + req.params.id);

    // On cherche dans la DB si l'id correspond, et on modifie sa bio
    try {
        await UserModel.findOneAndUpdate(
            filter,
            update,
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            },
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).json({ message: err });
            }
        );
    } catch (err) {
        if (err) return res.status(500).json({ message: err });
    }
};

// SUPPRIMER UN USER
exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'Successfully deleted.' });
    } catch (err) {
        if (err) return res.status(500).json({ message: err });
    }
};

// FOLLOW;
exports.follow = async (req, res) => {
    // si l'id passé en param ou req.body.id n'est pas dans la DB, on return erreur
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        // Ajout à la liste des followers (si on est suivit)
        const user = await UserModel.findByIdAndUpdate(
            req.params.id, // id de la personne qui est suivie
            { $addToSet: { following: req.body.idToFollow } }, // Update (addToSet : on rajoute l'id de la personne qui veut nous suivre dans following)
            { new: true, upsert: true }
        );

        // Ajout à la liste des follwing (incrémente le Array de la personne qui nous a suivit)
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow, //id de la personne qui nous a suivit
            {
                $addToSet: { followers: req.params.id }, // addToSet rajoute a ce qu'on a déjà
            },
            { new: true, upsert: true }
        );
        res.send(user);
    } catch (err) {
        if (err) res.status(500).json({ message: err });
    }
};

// UNFOLLOW
exports.unfollow = async (req, res) => {
    // si l'id passé en param ou req.body.id n'est pas dans la DB, on return erreur
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        // Ajout à la liste des followers (si on est suivit)
        const user = await UserModel.findByIdAndUpdate(
            req.params.id, // id de la personne qui est suivie
            { $pull: { following: req.body.idToUnfollow } }, // Update pull: retire l'id de la personne qui veut nous suivre dans following)
            { new: true, upsert: true }
        );
        // Ajout à la liste des follwing (incrémente le Array de la personne qui nous a suivit)
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow, //id de la personne qui nous a suivit
            {
                $pull: { followers: req.params.id }, // pull = enleve a ce qu'on a déjà
            },
            { new: true, upsert: true }
        );
        res.send(user);
    } catch (err) {
        if (err) res.status(500).json({ message: err });
    }
};
