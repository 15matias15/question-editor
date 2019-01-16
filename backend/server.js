const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const port = config.port;
const getUpload = require('./routes/getUpload');
const deleteLabel = require('./routes/deleteLabel');
const uploadLabel = require('./routes/uploadLabel');
const updateLabel = require('./routes/updateLabel');
const uploadFile = require('./routes/uploadFile');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = config.mongoUrl;

const app = express();

app.use(cors());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(url, (err, db) => {
    assert.strictEqual(null, err);
    console.log("Connected successfully to MongoDB server");
    app.locals.db = db.db('questionEditor');;

    app.listen(port, () => console.log(`Listening on port ${port}`))
})

app.use('/getUpload', getUpload);
app.use('/deleteLabel', deleteLabel);
app.use('/uploadLabel', uploadLabel);
app.use('/updateLabel', updateLabel);
app.use('/uploadFile', uploadFile);
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.json({
        message: err.message,
        error: err
    });
});
