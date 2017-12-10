import uuid from 'uuid/v4'

export default class Game {
  constructor (tournament) {
    this.id = uuid()
    this.turn = null
    this.moves = []
    this.state = this.defaultState()
    this.players = {}
    this.tournament = tournament
  }

  addPlayer (ws, name) {
    if (Object.keys(this.players).length > 1) {
      return false
    }

    this.players[ws.id] = {
      ws,
      name
    }

    return true
  }

  canStart () {
    return Object.keys(this.players).length === 2
  }

  move (move, side) {
    let {x, y} = move

    if (this.state[x][y] !== '-') {
      return false
    }

    this.moves.push({
      side, x: move.x, y: move.y
    })
    this.state[x][y] = side

    return true
  }

  isOver (move, side) {
    let {x, y} = move
    let lines = []
    let pattern = new RegExp('[' + side + ']{5,}')

    lines.push(this.state[x].join(''))
    lines.push(this.state.map(line => line[y]).join(''))
    lines.push(this.state.map((line, key) => line[y + x - key]).join(''))
    lines.push(this.state.map((line, key) => line[y - x + key]).join(''))

    return Boolean(lines.join('-').match(pattern))
  }

  randomizeTurn () {
    this.turn = Object.keys(this.players)[Math.round(Math.random())]
  }

  isTurning (player) {
    return this.turn === player.ws.id
  }

  giveTurn () {
    let ids = Object.keys(this.players)

    this.turn = this.turn === ids[0] ? ids[1] : ids[0]
  }

  defaultState () {
    return (new Array(20)).fill('-').map(() => (new Array(20)).fill('-'))
  }
}
