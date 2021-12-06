const mongoose = require('mongoose');

// == Connexion à la DB
mongoose
    .connect(
        'mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.lauwp.mongodb.net/MERN-PROJECT',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB : ', err);
    });
