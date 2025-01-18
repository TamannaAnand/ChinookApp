import express from 'express';
import { db } from '../app.js';
import multer from 'multer';
import { nanoid } from "nanoid";
import path from "path";
import { generateInsertStatement, generateUpdateStatement } from '../sqlgenerator.js';
import { validatePostAlbum, validatePatchAlbum } from '../validator.js'

//Creating Router for Express to route requests to 
const router = express.Router()

//Configure how multer behaves
const storage = multer.diskStorage({
    destination: './_FrontendStarterFiles/albumart',
    filename: function (req, file, callback) {
        const uniqueName = nanoid(12);
        const extension = path.extname(file.originalname)
        callback(null, uniqueName + extension)
    }
})

//Middleware to process files 
const upload = multer({ storage: storage })
router.use(express.json())

//ENDPOINTS for /add.html "/api/albums" - POST
router.post('/', (req, res) => {
    try {
        const validationResult = validatePostAlbum(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }
        //validation passed....

        const { sql, values } = generateInsertStatement('albums', req.body);

        const statement = db.prepare(sql)

        //statement.run(values) is what returns an object with the changes property
        const result = statement.run(values)
        res.status(201).send(result)

    } catch (err) {
        console.error("Error during POST request:", err); // Log the error - debugging 
        res.status(500).send({ message: 'Try Again Later' })
    }
})

//ENDPOINTS for /delete.html "/api/albums/${albumId}" - DELETE
router.delete('/:id', (req, res) => {
    try {
        //if there is variable piece of data, we need to handle if the id doesn't exist and the file can't be deleted so we need to send that response
        const statement = db.prepare('DELETE FROM albums WHERE AlbumId = ?')
        const { changes } = statement.run([req.params.id])
        console.log(changes)
        if (!changes) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }

    } catch (err) {
        res.status(500).send({ message: 'Try Again Later' })

    }

})

//ENDPOINTS for /edit.html "/api/albums/${albumId}" - GET
router.get('/:id', (req, res) => {
    try {
        //prepare statement and annouce it to datebase
        const statement = db.prepare('SELECT * FROM albums WHERE AlbumId = ?')
        //send query to database and execute it 
        const data = statement.get(req.params.id)
        if (!data) {
            return res.status(404).send()
        }
        //send data to the client
        res.send(data)

    } catch (err) {
        res.status(500).send({ message: 'Try Again Later' })
    }

})

//ENDPOINTS for /edit.html "/api/albums/${albumId}" - PATCH
router.patch('/:id', (req, res) => {
    try {

        const validationResult = validatePatchAlbum(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }

        const { sql, values } = generateUpdateStatement('albums', req.body, 'AlbumId', req.params.id)

        const statement = db.prepare(sql)
        const { changes } = statement.run(values)

        console.log(changes)

        if (!changes) {
            res.status(404).send()
        } else {
            res.status(200).send()
        }

    } catch (error) {
        res.status(500).send({ message: "Try again later" });
    }



})

//ENDPOINTS for /albumart.html "/api/albums/${albumId}/albumart" - POST & UPLOAD
router.post('/:id/albumart', upload.single('albumart'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
        }

        const albumId = req.params.id;
        const filename = req.file.filename;

        // Prepare and execute the SQL update
        const sql = `UPDATE albums SET AlbumArt = ? WHERE AlbumId = ?`;
        const statement = db.prepare(sql);

        const { changes } = statement.run(filename, albumId);
        if (!changes) {
            res.status(404).send({ message: 'Album not found.' });
        }

        res.status(200).json({ message: 'Album art updated successfully.', filename })

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Database update failed.' });
    }
});

//ENDPOINT in index.html "/api/albums/:id/tracks" - GET
router.get('/:id/tracks', (req, res) => {
    try {

        //prepare statement and annouce it to database
        const statement = db.prepare('SELECT * FROM tracks WHERE AlbumId = ?');
        //send query to database and execute it
        const data = statement.all(req.params.id)
        if (!data) {
            return res.status(404).send()
        }
        //send data to the client
        res.send(data)

    } catch (err) {
        res.status(500).send({ message: 'Try Again Later' })
    }

})

export default router