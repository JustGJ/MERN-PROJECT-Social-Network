const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({ path: './config/.env' }); // variables d'environnement
require('./config/db'); // connexion
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

// (middleware) les datas sont au bon format (bodyparser)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// (JWT) Sur n'importe quelle route, on vérifie si l'user a un id token etc
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

// (routes) On appel userRoutes lorsque l'URL est '/api/user'
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// (server) On écoute sur le port PORT
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
