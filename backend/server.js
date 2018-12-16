const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const port = config.port;
const routes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        message: err.message,
        error: err
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`));