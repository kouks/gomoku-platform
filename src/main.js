import cors from 'cors'
import http from 'http'
import uuid from 'uuid/v4'
import config from 'config'
import { Server } from 'ws'
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
  let id = uuid()
  tournaments[`/${id}`] = new Tournament(req.body.game_count)

  res.send({
    url: `ws://ws-${config.url}/${id}`
  })
})

app.get('/tournaments', (req, res) => {
  Mongo.connect(config.mongodb, (e, db) => {
    db.collection('tournaments').find({}).toArray((e, result) => {
      res.send(result.reverse())
    })
  })
})

const server = http.createServer(express())
const wss = new Server({ server })
server.listen(4000, config.url)

const tournaments = {}

wss.on('connection', (ws, req) => {
  if (tournaments[req.url] === undefined) {
    return
  }

  tournaments[req.url].onConnection(ws, req)

  ws.on('message', (message) => {
    tournaments[req.url].onMessage(ws, message)
  })
})
