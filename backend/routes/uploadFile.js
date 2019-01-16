const express = require('express');
const multer = require('multer');
const uploadFile = express.Router();
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

uploadFile.post('/', upload.single('file'), (req, res) => {
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
                        res.status("200").json({ status: "done", fileNewName: req.file.filename });
                    })
        } catch (e) {
            res.status("500").json({ status: "error" });
        }
    } else {
        res.status("409").json("No Files to Upload.");
    }
});

module.exports = uploadFile;