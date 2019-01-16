const express = require('express');
const assert = require('assert');
const deleteLabel = express.Router();
const ObjectID = require('mongodb').ObjectID;

deleteLabel.delete('/:id', (req, res) => {
    const myDb = req.app.locals.db;
    const id = req.params.id;

    myDb.collection('questionEditor')
        .deleteOne({ "_id": ObjectID(id) }, (err, r) => {
            assert.equal(null, err);
            assert.equal(1, r.result.ok);
            if (r.result.ok === 1) {
                myDb.collection('questionEditor')
                    .find({}).toArray((err, result) => {
                        assert.equal(null, err);
                        res.status("200").json(result);
                    })
            } else {
                res.status("500").json({ status: "error" });
            }
        })
});

module.exports = deleteLabel;