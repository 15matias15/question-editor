const express = require('express');
const updateLabel = express.Router();
const ObjectID = require('mongodb').ObjectID;

updateLabel.put('/', (req, res) => {
    const myDb = req.app.locals.db;
    req.checkBody('id', 'id is required').notEmpty();
    req.checkBody('type', 'type  is required').notEmpty();
    req.checkBody('name', 'name  is required').notEmpty();
    try {
        myDb.collection('questionEditor')
            .updateOne(
                { "_id": ObjectID(req.body.id) },
                { $set: { "name": req.body.name } }
                , (err, r) => {
                    if (err) {
                        res.status("500").json({ status: "error" });
                    }
                    res.status("200").json({ status: "done" });
                })
    } catch (e) {
        res.status("500").json({ status: "error" });
    }
});

module.exports = updateLabel;