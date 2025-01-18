import express from 'express';
import { db } from '../app.js';
import { generateInsertStatement, generateUpdateStatement } from '../sqlgenerator.js';
import { validatePatchTrack, validatePostTrack } from '../validator.js'

//Creating Router for Express to route requests to 
const router = express.Router()
router.use(express.json())

//ENDPOINTS for /add.html "/api/tracks" - POST
router.post('/', (req, res) => {
    try {
        const validationResult = validatePostTrack(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }
        //validation passed....
        const { sql, values } = generateInsertStatement('tracks', req.body);

        const statement = db.prepare(sql)

        //statement.run(values) is what returns an object with the changes property
        const result = statement.run(values)
        res.status(201).send(result)

    } catch (err) {
        console.error("Error during POST request:", err); // Log detailed error - debugging 
        res.status(500).send({ message: 'Try Again Later' })
    }
})

//ENDPOINTS for /delete.html "/api/tracks/${trackId}" - DELETE
router.delete('/:id', (req, res) => {
    try {
        //if there is variable piece of data, we need to handle if the id doesn't exist and the file can't be deleted so we need to send that response
        const statement = db.prepare('DELETE FROM tracks WHERE TrackId = ?')
        const { changes } = statement.run(req.params.id)
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

//ENDPOINTS for /edit.html `/api/tracks/${trackId}' - GET
router.get('/:id', (req, res) => {
    try {
        //prepare statement and annouce it to datebase
        const statement = db.prepare('SELECT * FROM tracks WHERE TrackId = ?')
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

//ENDPOINTS for /edit.html `/api/tracks/${trackId}' - PATCH
router.patch('/:id', (req, res) => {
    try {

        const validationResult = validatePatchTrack(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }

        const { sql, values } = generateUpdateStatement('tracks', req.body, 'TrackId', req.params.id)

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


export default router