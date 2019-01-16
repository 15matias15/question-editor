const express = require('express');
const assert = require('assert');
const uploadLabel = express.Router();

uploadLabel.post('/', (req, res) => {
    const myDb = req.app.locals.db;
    req.checkBody('id', 'id is required').notEmpty();
    req.checkBody('type', 'type  is required').notEmpty();
    myDb.collection('questionEditor')
        .insertOne(
            req.body
            , (err, r) => {
                assert.equal(null, err);
                assert.equal(1, r.result.ok);
                if (r.result.ok === 1) {
                    res.status("200").json({ status: "done", idMongo: r.insertedId });
                } else {
                    res.status("500").json({ status: "error" });
                }
            });
});

module.exports = uploadLabel;