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
            <span v-bind:class="getPlayerColor(getPlayer('x', game.players))">
              {{ getPlayer('x', game.players) }}
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
            <span v-bind:class="getPlayerColor(getPlayer('o', game.players))">
              <i class="fa fa-circle-o-notch" aria-hidden="true"></i>
              {{ getPlayer('o', game.players) }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-lg-8 text-center game-canvas">
      <div class="game text-center">
        <game-canvas
          :players="players"
          :game="games[active]"
        ></game-canvas>
      </div>
    </div>
  </div>
</template>

<script>
import GameCanvas from '@/components/elements/GameCanvas'

export default {
  components: {
    GameCanvas
  },

  props: ['players', 'games'],

  data () {
    return {
      active: 0
    }
  },

  methods: {
    // ADSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
    getPlayer (side, players) {
      let id = Object.keys(players).find((player, key) => {
        if (players[player].side === side) {
          return true
        }
      })

      return players[id].name
    },

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

      if (game.players[winner].name === this.players[0]) {
        return {'player1-won': true}
      }

      return {'player2-won': true}
    }
  }
}
</script>
