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

    ws.send(JSON.stringify({'type': 'hello'}))
    ws.on('message', message => {
      try {
        message = JSON.parse(message)
      } catch (e) {
        ws.send(JSON.stringify({ ok: false, error: 'Invalid json.' }))

        return
      }

      if (this[message.type] === undefined) {
        ws.send(JSON.stringify({ ok: false, error: 'Invalid event.' }))

        return
      }

      this[message.type](ws, message)
    })
  }

  ready (ws, message) {
    if (message.name === undefined) {
      ws.send(JSON.stringify({ ok: false, error: 'Name field missing.' }))

      return
    }

    if (this.players.length > 1) {
      ws.send(JSON.stringify({ ok: false, error: 'Too many players.' }))

      return
    }

    ws.send(JSON.stringify({ ok: true }))

    if (this.games.length === this.gameCount) {
      ws.send(JSON.stringify({ type: 'tournament_over' }))
      this.wss.close()

      return
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

      ws.send(JSON.stringify({ type: 'new_game', side: this.players[key].side }))

      if (key === this.turn) {
        ws.send(JSON.stringify({ type: 'your_move', game: { id: game.id, state: game.state } }))
      }
    })
  }

  move (ws, message) {
    let player = this.players[this.turn]

    if (player === undefined || ws !== player.ws) {
      ws.send(JSON.stringify({ ok: 'false', error: 'Not your move.' }))

      return
    }

    if (message.game === undefined || message.game.id === undefined || message.game.move === undefined ||
      message.game.move.x === undefined || message.game.move.y === undefined) {
      ws.send(JSON.stringify({
        ok: 'false',
        error: 'Invalid request, requested format: { ... game: { id: int, moves: { x: int, y: int }}}'
      }))

      return
    }

    let move = message.game.move

    if (move.x > 19 || move.x < 0 || move.y > 19 || move.y < 0) {
      ws.send(JSON.stringify({ ok: 'false', error: 'The move [' + move.x + ', ' + move.y + '] is out of bounaries.' }))

      return
    }

    let game = this.games[message.game.id]

    if (game === undefined) {
      ws.send(JSON.stringify({ ok: 'false', error: 'Bad game id.' }))

      return
    }

    if (!game.move(move, player.side)) {
      ws.send(JSON.stringify({ ok: 'false', error: 'Move is invalid.' }))

      return
    }

    if (game.checkEnd(move, player.side)) {
      // new game
    }

    ws.send(JSON.stringify({ ok: true }))
    this.turn = this.turn === 1 ? 0 : 1

    this.players.forEach(({ ws }, key) => {
      if (key === this.turn) {
        ws.send(JSON.stringify({ type: 'your_move', game: { id: game.id, state: game.state } }))
      }
    })
  }

  url () {
    return `${config.url.ws}:${this.port}`
  }
}
