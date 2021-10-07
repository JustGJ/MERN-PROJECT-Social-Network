const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

// == inscription
exports.signUp = async (req, res) => {
    // Destructuring : req.body.pseudo = pseudo
    const { pseudo, email, password } = req.body;

    try {
        const user = await UserModel.create({ pseudo, email, password }); //pseudo: req.body.pseudo ... On remplit les informations du schéma que l'on souhaite. Pas obliger de remplir bio etc. c'est du NOSQL
        res.status(201).json({ user: user._id }); // Si succès, affiche json
    } catch (err) {
        const errors = this.signUpErrors(err);
        res.status(200).send({ errors });
    }
};

// == Connexion : Ajout du token dans le cookie
exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password); //Vérifie si l'email et password correspondent à la DB
        const token = createToken(user._id); // Création token
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge }); // on stocke dans les cookies : nom du cookie/token/sécurité-max age
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = this.signInErrors(err);
        res.status(200).json({ errors });
    }
};

// == Déconnexion : Retire token dans le cookie
exports.signOut = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // On retire le cookie, réduit l'age à 1ms
    res.redirect('/');
};
