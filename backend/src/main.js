import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import Tournament from './Tournament'

/*
|
| We boot up the http server and listed on a given port.
|
*/

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.server = http.createServer(app)
app.server.listen(3000)

app.post('/tournaments', (req, res) => {
  const tournament = new Tournament(req.body.game_count)

  res.send({
    url: tournament.url()
  })
})
