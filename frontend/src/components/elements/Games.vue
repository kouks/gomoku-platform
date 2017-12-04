<template>
  <div class="games">
    <div class="col-md-12 col-lg-4 list">
      <div
        :key="key"
        class="item"
        v-for="(game, key) in games"
        v-bind:class="getGameResult(game)"
        @click="active = key">
        <div>
          Game #{{ key + 1 }}
          <p>
            <span v-bind:class="getPlayerColor(game.players['x'])">
              {{ game.players['x'] }}
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
            <span v-bind:class="getPlayerColor(game.players['o'])">
              <i class="fa fa-circle-o-notch" aria-hidden="true"></i>
              {{ game.players['o'] }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-lg-8 text-center game-canvas">
      <div class="game text-center">
        <div class="col-md-12">
          <game class="canvas" :game="games[active]" :players="players"></game>
        </div>
        <div class="col-md-12">
          <div class="controls">
            <div>
              <i class="fa fa-angle-double-left" aria-hidden="true"></i>
            </div>
            <div>
              <i class="fa fa-play" aria-hidden="true"></i>
            </div>
            <div>
              <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Game from '@/components/elements/Game'

export default {
  components: {
    Game
  },

  props: ['players', 'games'],

  data () {
    return {
      active: 0
    }
  },

  methods: {
    getPlayerColor (player) {
      if (player === this.players[0]) {
        return {'player1': true}
      }

      return {'player2': true}
    },

    getGameResult (game) {
      let winner = game.winner

      if (!winner) {
        return {}
      }

      if (winner === this.players[0]) {
        return {'player1-won': true}
      }

      return {'player2-won': true}
    }
  }
}
</script>
