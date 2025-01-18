//Imports
import express from "express";
import Database from "better-sqlite3";
const port = process.env.PORT || 4000;

//import routers
import artistsRouter from './routes/artists.js'
import albumsRouter from './routes/albums.js'
import tracksRouter from './routes/tracks.js'

//Create express application instance
const app = express();

//Middleware to capture payload in JSON format 
app.use(express.json())
//Middleware to handle data recieved in URL encoded format 
app.use(express.urlencoded({ extended: true })) 
//Middleware to set the router for the given url
app.use('/api/artists', artistsRouter)
app.use('/api/albums', albumsRouter)
app.use('/api/tracks', tracksRouter )

//Middleware to serve up static content- https://expressjs.com/en/starter/static-files.html
app.use(express.static('_FrontendStarterFiles'))

//Establish connection to database & add safeguard to makre sure file is there
export const db = new Database('./database/chinook.sqlite', { fileMustExist: true })



//ENDPOINT for index.html '/api/themes' GET
app.get('/api/themes', (req, res) => {
    //prepare statement and annouce it to datebase
    const statement = db.prepare('SELECT * FROM themes')
    //send query to database and execute it
    const data = statement.all()
    //send data to the client
    res.send(data)
})

//ENDPOINT for /tracks/edit.html '/api/mediatypes' GET
app.get('/api/mediatypes', (req, res) => {
    //prepare statement and annouce it to datebase
    const statement = db.prepare('SELECT * FROM media_types')
    //send query to database and execute it
    const data = statement.all()
    //send data to the client
    res.send(data)

})


//Listen for REQs on port 3000
app.listen(port, () => {
    console.log(`Listen on port ${port}`);
})


















