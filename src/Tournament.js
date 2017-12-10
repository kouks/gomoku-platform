import Game from './Game'
import uuid from 'uuid/v4'
import config from 'config'
import Logger from './Logger'
import Socket from './Socket'
import Move from '@/Handlers/Move'
import Ready from '@/Handlers/Ready'
import { MongoClient as Mongo } from 'mongodb'

export default class Tournament {
  constructor (gameCount, id) {
    this.id = id
    this.gameCount = gameCount
    this.spectators = {}
    this.currentGame = new Game(this)

    this.games = [this.currentGame]
  }

  onConnection (ws, req) {
    // Log that a new client has connected on a port specific to this
    // tournament and send him the 'hello' event.
    Logger.log('Client connected on url: ' + req.url)
    Socket.send(ws, { type: 'hello' })

    // Assign a uuid to the websocket client.
    ws.id = uuid()
  }

  onMessage (ws, message) {
    if ((message = this.parseMessage(message)) === null) {
      return Socket.send(ws, { ok: false, error: 'invalid_json' })
    }

    switch (message.type) {
      case 'ready':
        Ready.handle(this, ws, message)
        break
      case 'move':
        Move.handle(this, ws, message)
        break
      default:
        Socket.send(ws, { ok: false, error: 'invalid_event' })
    }
  }

  parseMessage (message) {
    try {
      return JSON.parse(message)
    } catch (e) {
      return null
    }
  }

  write () {
    Mongo.connect(config.mongodb, (e, db) => {
      db.collection('tournaments').insertOne({
        id: this.id,
        game_count: this.gameCount,
        players: Object.values(this.currentGame.players).map((player) => {
          return player.name
        }),
        games: this.games.map((game) => {
          let ids = Object.keys(game.players)

          return {
            id: game.id,
            winner: game.winner,
            state: game.state,
            moves: game.moves,
            players: {
              [ids[0]]: {
                name: game.players[ids[0]].name,
                side: game.players[ids[0]].side
              },
              [ids[1]]: {
                name: game.players[ids[1]].name,
                side: game.players[ids[1]].side
              }
            }
          }
        })
      })
    })
  }
}
