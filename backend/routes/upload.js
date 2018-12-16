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

router.post('/upload', upload.single('file'), (req, res) => {
    var filename = req.file.filename;
    req.body.filename = filename;

    if (req.file) {
        console.log('File uploaded...');
        req.checkBody('id', 'id is required').notEmpty();
        req.checkBody('type', 'type  is required').notEmpty();
        MongoClient.connect(url, (err, db) => {
            assert.strictEqual(null, err);
            console.log("Connected successfully to MongoDB server");
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

module.exports = router;