const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// == Schéma du user dans la DB
const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6,
        },
        picture: {
            type: String,
            default: './uploads/profil/random-user.png',
        },
        bio: {
            type: String,
            max: 1024,
        },
        followers: {
            type: [String],
        },
        following: {
            type: [String],
        },
        likes: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password : Fonction s'active avant de sauvegarder dans la DB
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(); // sald contient de quoi salé le mdp
    this.password = await bcrypt.hash(this.password, salt); // On hash notre password grace au salt
    next(); // On passe à la suite
});

// On doit vérifier si le mdp salé(crypt) correspond bien au mdp dans l'input
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email }); // On cherche dans userSchema email
    if (user) {
        const auth = await bcrypt.compare(password, user.password); // On compare : user.password = mdp crtypé, password = mdp dans input
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

// == On incrémentera userSchema dans la table user
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
