const express = require('express');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config');
const url = config.mongoUrl;
const router = express.Router();

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
    MongoClient.connect(url, (err, db) => {
        assert.strictEqual(null, err);
        console.log("Connected successfully to MongoDB server // GET");
        const myDb = db.db('questionEditor');

        myDb.collection('questionEditor')
            .find({}).toArray((err, result) => {
                assert.equal(null, err);
                db.close();
                res.status("200").json(result);
            })
    });
});

router.post('/upload', upload.single('file'), (req, res) => {
    var filename = req.file.filename;
    req.body.filename = filename;

    if (req.file) {
        console.log('File uploaded...');
        req.checkBody('id', 'id is required').notEmpty();
        req.checkBody('type', 'type  is required').notEmpty();
        MongoClient.connect(url, (err, db) => {
            assert.strictEqual(null, err);
            console.log("Connected successfully to MongoDB server // POST");
            const myDb = db.db('questionEditor');

            myDb.collection('questionEditor')
                .insertOne(
                    req.body
                    , function (err, r) {
                        assert.equal(null, err);
                        assert.equal(1, r.result.ok);
                        db.close();
                        if (r.result.ok === 1) {
                            res.status("200").json({ status: "done", fileNewName: req.body.filename });
                        } else {
                            res.status("500").json({ status: "error" });
                        }
                    });
        });

    } else {
        res.status("409").json("No Files to Upload.");
    }
});

router.delete('/upload/:id/:type', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        assert.strictEqual(null, err);
        console.log("Connected successfully to MongoDB server // DELETE");
        const id = req.params.id
        const type = req.params.type;
        const myDb = db.db('questionEditor');

        myDb.collection('questionEditor')
            .deleteOne({ type: type, id: id }, (err, r) => {
                assert.equal(null, err);
                assert.equal(1, r.result.ok);
                if (r.result.ok === 1) {
                    myDb.collection('questionEditor')
                        .find({}).toArray((err, result) => {
                            assert.equal(null, err);
                            db.close();
                            res.status("200").json(result);
                        })
                } else {
                    db.close();
                    res.status("500").json({ status: "error" });
                }
            })
    });
});

module.exports = router;