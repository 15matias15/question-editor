const express = require('express');
const multer = require('multer');
const assert = require('assert');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

//FILE FORMAT VALIDATION
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

//STORAGE LOCATION & FILENAME
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});

router.get('/upload', (req, res) => {
    const myDb = req.app.locals.db;
    myDb.collection('questionEditor')
        .find({}, { _id: 0 }).toArray((err, result) => {
            assert.equal(null, err);
            res.status("200").json(result);
        })
});

router.post('/uploadLabel', (req, res) => {
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
                    res.status("200").json({ status: "done", fileNewName: req.body.filename });
                } else {
                    res.status("500").json({ status: "error" });
                }
            });
});

router.put('/updateLabel', (req, res) => {
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

router.post('/uploadFile', upload.single('file'), (req, res) => {
    const myDb = req.app.locals.db;
    var filename = req.file.filename;
    if (req.file) {
        console.log('File uploaded...');
        req.checkBody('id', 'id is required').notEmpty();
        try {
            myDb.collection('questionEditor')
                .updateOne(
                    { "_id": ObjectID(req.body.id) },
                    { $set: { "filename": filename } }
                    , (err, r) => {
                        if (err) {
                            res.status("500").json({ status: "error" });
                        }
                        res.status("200").json({ status: "done", fileNewName: req.body.filename });
                    })
        } catch (e) {
            res.status("500").json({ status: "error" });
        }
    } else {
        res.status("409").json("No Files to Upload.");
    }
});

router.delete('/upload/:id/:type', (req, res) => {
    const myDb = req.app.locals.db;
    const id = req.params.id
    const type = req.params.type;

    myDb.collection('questionEditor')
        .deleteOne({ type: type, id: id }, (err, r) => {
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

module.exports = router;