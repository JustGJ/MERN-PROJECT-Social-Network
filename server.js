const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

require('dotenv').config({ path: './config/.env' }); // variables d'environnement
require('./config/db'); // connexion
const path = require('path');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

// (middleware) les datas sont au bon format (bodyparser)
const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
};

app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.get('/', (res, res) => res.send('good'));
// (JWT) Sur n'importe quelle route, on vérifie si l'user a un id token etc
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

// (routes) On appel userRoutes lorsque l'URL est '/api/user'
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// For Heroku
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Api running');
    });
}

// (server) On écoute sur le port PORT
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
