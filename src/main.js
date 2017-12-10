import cors from 'cors'
import http from 'http'
import config from 'config'
import express from 'express'
import bodyParser from 'body-parser'
import Tournament from './Tournament'
import { MongoClient as Mongo } from 'mongodb'

/*
|
| We boot up the http server and listed on a given port.
|
*/

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.server = http.createServer(app)
app.server.listen(3000, config.url)

app.post('/tournaments', (req, res) => {
  const tournament = new Tournament(req.body.game_count)

  res.send({
    url: tournament.url()
  })
})

app.get('/tournaments', (req, res) => {
  Mongo.connect(config.mongodb, (e, db) => {
    db.collection('tournaments').find({}).toArray((e, result) => {
      res.send(result)
    })
  })
})
