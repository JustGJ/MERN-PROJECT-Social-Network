const express = require('express');
require('dotenv').config({ path: './config/.env' }); // Récupération variables d'environnement
require('./config/db'); // Récupération de la connexion
const app = express();

// == On écoute sur le port PORT
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
