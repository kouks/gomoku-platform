import Game from '@/Game'
import Socket from '@/Socket'

export default class Move {
  static handle (tournament, ws, message) {
    let game = tournament.currentGame
    let player = game.players[ws.id]

    // Check if it is the client's move.
    if (player === undefined || !game.isTurning(player)) {
      game.giveTurn()
      Socket.send(ws, { ok: false, error: 'not_your_move' })
      return this.endGame(tournament, game)
    }

    // Check if we got valid data from the client.
    if (this.messageInvalid(message)) {
      return Socket.send(ws, { ok: false, error: 'invalid_message_format' })
    }

    // Get the move object from the message json.
    let move = message.move

    // Check if the move is in boundaries.
    if (move.x > 19 || move.x < 0 || move.y > 19 || move.y < 0) {
      game.giveTurn()
      Socket.send(ws, { ok: false, error: 'move_out_of_bounds' })
      return this.endGame(tournament, game)
    }

    // Check if the move is possible.
    if (!game.move(move, player.side)) {
      game.giveTurn()
      Socket.send(ws, { ok: false, error: 'invalid_move' })
      return this.endGame(tournament, game)
    }

    // Inform the client that his request was accepted and we started processing
    // the response.
    Socket.send(ws, { ok: true })

    // Check if the game or the tournament have ended.
    if (game.isOver(move, player.side)) {
      return this.endGame(tournament, game)
    }

    // Give turn to the other player.
    game.giveTurn()

    // Inform the other client about that it is their turn.
    Object.values(game.players).forEach((player) => {
      if (game.isTurning(player)) {
        Socket.send(player.ws, { type: 'your_move', state: game.state, moves: game.moves })
      }
    })
  }

  static endGame (tournament, game, winner) {
    let gamesCount = tournament.games.length

    Object.values(game.players).forEach(({ ws }, key) => {
      if (gamesCount >= tournament.gameCount) {
        Socket.send(ws, { type: 'tournament_over' })
      } else {
        Socket.send(ws, { type: 'game_over' })
      }
    })

    game.winner = game.turn

    if (gamesCount >= tournament.gameCount) {
      tournament.write()
    } else {
      tournament.currentGame = new Game(tournament)
      tournament.games.push(tournament.currentGame)
    }
  }

  static messageInvalid (message) {
    return message.move === undefined || message.move.x === undefined || message.move.y === undefined
  }
}
