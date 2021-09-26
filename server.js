const express = require('express');
const app = express();

// == On écoute sur le port 5000
app.listen(5000, () => {
    console.log('Listening on port 5000');
});
