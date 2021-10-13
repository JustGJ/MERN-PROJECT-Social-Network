const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// On vérifie si l'user est connecté (token) tout au long de sa navigation sur le site
exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // Si on a un token pendant la navigation, on le vérifie en le décryptant
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                // bug ???
                // res.cookies('jwt', '', { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                console.log(user);
                next();
            }
        });
        // Si on a pas de token
    } else {
        res.locals.user = null;
        next();
    }
};

// On vérifie lors de la connexion si le token correspond à quelqu'un de la DB
exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // Si on a un token pendant la navigation, on le vérifie en le décryptant
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
};
