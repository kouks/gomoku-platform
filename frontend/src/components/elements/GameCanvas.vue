<template>
  <div>
    <div class="col-md-12">
      <div class="canvas">
        <div class="canvas-row" v-for="(row, x) in state" :key="x">
          <div
            :key="y"
            class="canvas-cell"
            v-for="(cell, y) in row"
            v-html="getIcon(cell)"></div>
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <div class="controls">
        <div @click="undoLastMove">
          <i class="fa fa-angle-double-left" aria-hidden="true"></i>
        </div>
        <div @click="isPlaying = !isPlaying">
          <i
            aria-hidden="true"
            class="fa"
            v-bind:class="{'fa-play': !isPlaying, 'fa-pause': isPlaying}"
          ></i>
        </div>
        <div @click="doNextMove">
          <i class="fa fa-angle-double-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['game', 'players'],

  data () {
    return {
      state: [],
      nextMove: 0,
      playInterval: null,
      isPlaying: false
    }
  },

  mounted () {
    // this.resetState()

    this.state = this.game.state

    this.nextMove = this.game.moves.length
  },

  watch: {
    isPlaying (bool) {
      if (bool) {
        this.playInterval = setInterval(this.makeMove, 300)

        return
      }

      clearInterval(this.playInterval)
    }
  },

  methods: {
    makeMove () {
      if (this.nextMove === this.game.moves.length) {
        if (this.game.hasOwnProperty('winner')) {
          this.isPlaying = false
        }

        return
      }

      this.doNextMove()
    },

    doNextMove () {
      if (this.nextMove > this.game.moves.length - 1) {
        return
      }

      let move = this.game.moves[this.nextMove]

      this.move(move.player, move.x, move.y)

      this.nextMove++
    },

    undoLastMove () {
      if (this.nextMove === 0) {
        return
      }

      let lastMove = this.game.moves[this.nextMove - 1]

      this.move('-', lastMove.x, lastMove.y)

      this.nextMove--
    },

    move (player, x, y) {
      this.state[x][y] = player

      this.$forceUpdate()
    },

    resetState () {
      this.state = (new Array(20)).fill('-').map((row) => {
        return (new Array(20)).fill('-')
      })
    },

    getIcon (type) {
      if (type === '-') {
        return ''
      }

      let style = 'player1'

      if (this.game.players[type] !== this.players[0]) {
        style = 'player2'
      }

      // We don't like some people.
      switch (type) {
        case 'x':
          return '<i class="fa fa-times ' + style + '" aria-hidden="true"></i>'

        case 'o':
          return '<i class="fa fa-circle-o-notch ' + style + '" aria-hidden="true"></i>'

        default:
          return ''
      }
    }
  }
}
</script>

<style lang="sass">
  .canvas-row
    width: 100%
    overflow: hidden
    height: 16px
    box-sizing: border-box

    & .canvas-cell
      height: 16px
      width: 16px
      overflow: hidden
      box-sizing: border-box
      display: inline-block
      border-bottom: 1px solid #f0f0f0
      border-left: 1px solid #f0f0f0

</style>
