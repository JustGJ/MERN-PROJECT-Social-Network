const UserModel = require('../models/user.model');
// Dépendances de node
const fs = require('fs'); // Permet d'incrémenter des éléments dans des fichiers
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);

exports.uploadProfil = async (req, res) => {
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

    // Nom de l'image
    const fileName = req.body.name + '.jpg';

    // On crée le chemin de l'image
    await pipeline(
        req.file.stream,
        fs.createWriteStream(`${__dirname}/../client/public/uploads/profil/${fileName}`)
    );

    // On envoie à MongoDB
    try {
        UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: './uploads/profil/' + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
