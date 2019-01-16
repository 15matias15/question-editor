const express = require('express');
const assert = require('assert');
const getUpload = express.Router();

getUpload.get('/', (req, res) => {
    const myDb = req.app.locals.db;
    myDb.collection('questionEditor')
        .find({}, { _id: 0 }).toArray((err, result) => {
            assert.equal(null, err);
            res.status("200").json(result);
        })
});

module.exports = getUpload;