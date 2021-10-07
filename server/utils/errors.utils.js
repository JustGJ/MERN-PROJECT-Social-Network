// Registrer errors
exports.SignUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('pseudo')) errors.pseudo = 'Pseudo incorrect ou déjà pris';
    if (err.message.includes('email')) errors.email = 'Email incorrect ou déjà pris';
    if (err.message.includes('password')) errors.password = 'Le mdp doit faire 6 caractère minimum';

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
        errors.pseudo = 'Cet pseudo est déjà pris';
    }

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Cet email est déjà enregistré';
    }

    return errors;
};

// Login errors
exports.SignInErrors = (err) => {
    let errors = { email: '', password: '' };

    if (err.message.includes('email')) errors.email = 'Email inconnu';
    if (err.message.includes('password')) errors.password = 'Le mdp ne correspond pas';

    return errors;
};
