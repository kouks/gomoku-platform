<template>
  <div>
    <div class="canvas-row" v-for="(row, x) in game.state" :key="x">
      <div
        :key="y"
        class="canvas-cell"
        v-for="(cell, y) in row"
        v-html="getIcon(cell)"></div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['game', 'players'],

  data () {
    return {
      state: []
    }
  },

  mounted () {
    this.state = this.game.state
  },

  methods: {
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
