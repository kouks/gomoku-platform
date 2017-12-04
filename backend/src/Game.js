export default class Game {
  constructor (players) {
    this.id = (new Date()).getTime()
    this.players = players
    this.state = this.defaultState()
  }

  move (pos, side) {
    let {x, y} = pos

    if (this.state[x][y] !== '-') {
      return false
    }

    this.state[x][y] = side

    return true
  }

  checkEnd (lastMove, side) {
    let {x, y} = lastMove
    let lines = []
    let pattern = new RegExp('[' + side + ']{5,}')

    lines.push(this.state[x].join(''))
    lines.push(this.state.map(line => line[y]).join(''))
    lines.push(this.state.map((line, key) => line[y + x - key]).join(''))
    lines.push(this.state.map((line, key) => line[y - x + key]).join(''))
    console.log(Boolean(lines.join('-').match(pattern)))
    return Boolean(lines.join('-').match(pattern))
  }

  defaultState () {
    return [
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-'),
      (new Array(20)).fill('-')
    ]
  }
}
