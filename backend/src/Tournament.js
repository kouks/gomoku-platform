import Game from './Game'
import { Server } from 'ws'
import config from 'config'

export default class Tournament {
  constructor (gameCount) {
    this.port = Math.floor(Math.random() * 10000 + 30000)
    this.turn = Math.round(Math.random())
    this.id = (new Date()).getTime()
    this.gameCount = gameCount
    this.players = []
    this.games = {}

    this.wss = new Server({ port: this.port })
    this.wss.on('connection', (ws, client) => this.onConnection(ws, client))
  }

  onConnection (ws, client) {
    console.log('Client connected, port: ' + this.port)

    this.send(ws, {'type': 'hello'})

    ws.on('message', (message) => {
      try {
        message = JSON.parse(message)
      } catch (e) {
        return this.send(ws, { ok: false, error: 'Invalid json.' })
      }

      if (this[message.type] === undefined) {
        return this.send(ws, { ok: false, error: 'Invalid event.' })
      }

      this[message.type](ws, message)
    })
  }

  ready (ws, message) {
    if (message.name === undefined) {
      return this.send(ws, { ok: false, error: 'Name field missing.' })
    }

    if (this.players.length > 1) {
      return this.send(ws, { ok: false, error: 'Too many players.' })
    }

    this.send(ws, { ok: true })

    if (this.games.length === this.gameCount) {
      this.send(ws, { type: 'tournament_over' })
      return this.wss.close()
    }

    this.players.push({
      ws, name: message.name
    })

    if (this.players.length !== 2) {
      return
    }

    let game = new Game(this.players)

    this.games[game.id] = game

    this.players.forEach(({ ws }, key) => {
      this.players[key].side = key === this.turn ? 'x' : 'o'

      this.send(ws, { type: 'new_game', side: this.players[key].side })

      if (key === this.turn) {
        this.send(ws, { type: 'your_move', game: { id: game.id, state: game.state } })
      }
    })
  }

  move (ws, message) {
    let player = this.players[this.turn]

    if (player === undefined || ws !== player.ws) {
      return this.send(ws, { ok: 'false', error: 'Not your move.' })
    }

    if (message.game === undefined || message.game.id === undefined || message.game.move === undefined ||
      message.game.move.x === undefined || message.game.move.y === undefined) {
      return this.send(ws, {
        ok: 'false',
        error: 'Invalid request, requested format: { ... game: { id: int, moves: { x: int, y: int }}}'
      })
    }

    let move = message.game.move

    if (move.x > 19 || move.x < 0 || move.y > 19 || move.y < 0) {
      return this.send(ws, { ok: 'false', error: 'The move [' + move.x + ', ' + move.y + '] is out of bounaries.' })
    }

    let game = this.games[message.game.id]

    if (game === undefined) {
      return this.send(ws, { ok: 'false', error: 'Bad game id.' })
    }

    if (!game.move(move, player.side)) {
      return this.send(ws, { ok: 'false', error: 'Move is invalid.' })
    }

    console.log(game.checkEnd(move, player.side))
    if (game.checkEnd(move, player.side)) {
      return this.players.forEach(({ ws }, key) => {
        if (key === this.turn) {
          this.send(ws, { type: 'game_over' })
        }
      })
    }

    this.send(ws, { ok: true })
    this.turn = this.turn === 1 ? 0 : 1

    this.players.forEach(({ ws }, key) => {
      if (key === this.turn) {
        this.send(ws, { type: 'your_move', game: { id: game.id, state: game.state } })
      }
    })
  }

  send (ws, message) {
    return ws.send(JSON.stringify(message))
  }

  url () {
    return `${config.url.ws}:${this.port}`
  }
}
