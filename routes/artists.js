import express from 'express';
import { db } from '../app.js';
import { generateInsertStatement, generateUpdateStatement } from '../sqlgenerator.js';
import { validatePostArtist, validatePatchArtist } from '../validator.js'

//Creating Router for Express to route requests to 
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//ENDPOINT for index.html '/api/artists/search/${encodeURIComponent(searchTerm)}' GET
router.get('/search/:searchTerm', (req, res) => {
    try {

        const { searchTerm } = req.params;

        // You can now use searchTerm to query your database and find matching artists
        const statement = db.prepare('SELECT * FROM artists WHERE name LIKE ?');
        const data = statement.all(`%${searchTerm}%`); //  Wraps the search term with %, which is a SQL wildcard for matching any characters before or after the search term.

        if (!data || data.length === 0) {
            return res.status(201).send('No artists found');
        }

        res.json(data); // Send matching artists as JSON response

    } catch (err) {
        res.status(500).send({ message: 'Try Again Later' })
    }

});

//ENDPOINTS for /delete.html "/api/artists/:id" - DELETE
router.delete('/:id', (req, res) => {
    try {
        //if there is variable piece of data, we need to handle if the id doesn't exist and the file can't be deleted so we need to send that response
        const statement = db.prepare('DELETE FROM artists WHERE ArtistId = ?')
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

//ENDPOINTS for /add.html "/api/artists" - POST
router.post('/', (req, res) => {
    try {
        const validationResult = validatePostArtist(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }
        //validation passed....

        const { sql, values } = generateInsertStatement('artists', req.body)

        const statement = db.prepare(sql)

        //statement.run(values) is what returns an object with the changes property
        const result = statement.run(values)
        res.status(201).send(result)

    } catch (err) {
        console.error("Error during POST request:", err); // Log detailed error
        res.status(500).send({ message: 'Try Again Later' })
    }
})

//ENDPOINTS for /edit.html "/api/artists/${artistId}" GET
router.get('/:id', (req, res) => {
    try {

        //prepare statement and annouce it to datebase
        const statement = db.prepare('SELECT * FROM artists WHERE ArtistId = ?')
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

//ENDPOINTS for /edit.html "/api/artists/${artistId}" PATCH
router.patch('/:id', (req, res) => {
    try {

        const validationResult = validatePatchArtist(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }

        const { sql, values } = generateUpdateStatement('artists', req.body, 'ArtistId', req.params.id)

        const statement = db.prepare(sql)
        const { changes } = statement.run(values)

        console.log(changes)

        if (!changes) {
            res.status(404).send()
        } else {
            res.status(200).send()
        }

    } catch (error) {
        console.error("Error during POST request:", error); // Log detailed error
        res.status(500).send({ message: "Try again later" });
    }



})

//ENDPOINT for /index.html "/api/artists" GET
router.get('/', (req, res) => {

    try {
        //prepare statement and annouce it to datebase
        const statement = db.prepare('SELECT * FROM artists')
        //send query to database and execute it
        const data = statement.all()
        //send data to the client
        res.send(data)

    } catch (err) {
        res.status(500).send({ message: 'Try Again Later' })
    }


})

//ENDPOINT for /index.html "/api/artists${artistId}/albums" GET
router.get('/:id/albums', (req, res) => {
    try {

        //prepare statement and annouce it to datebase
        const statement = db.prepare('SELECT * FROM albums WHERE ArtistId = ?')
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