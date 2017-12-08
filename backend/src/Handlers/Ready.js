import Socket from '@/Socket'

export default class Ready {
  static handle (tournament, ws, message) {
    // If the bot name is missing, refuse the request
    if (message.name === undefined) {
      return Socket.send(ws, { ok: false, error: 'invalid_message_format' })
    }

    // If there are already 2 players in the game, refuse the player.
    if (!tournament.currentGame.addPlayer(ws, message.name)) {
      return Socket.send(ws, { ok: false, error: 'too_many_players' })
    }

    // Inform the client that his request was accepted and we started processing
    // the response.
    Socket.send(ws, { ok: true })

    // If the game is ready to start, do so.
    if (tournament.currentGame.canStart()) {
      this.startGame(tournament.currentGame)
    }
  }

  static startGame (game) {
    game.randomizeTurn()

    Object.values(game.players).forEach((player) => {
      player.side = game.isTurning(player) ? 'x' : 'o'

      Socket.send(player.ws, { type: 'new_game', side: player.side })

      if (game.isTurning(player)) {
        Socket.send(player.ws, { type: 'your_move', state: game.state, moves: [] })
      }
    })
  }
}
