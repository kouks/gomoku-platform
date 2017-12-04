<template>
  <div class="result-board">
    <div class="col-xs-5 player-name"
      v-bind:class="getResultForPlayer(player1.wins, player2.wins)">
      <h1>{{ player1.name }}</h1>
      <h3>{{ player1.wins }}</h3>
    </div>
    <div class="col-xs-2 text-center">
      <h2>vs</h2>
    </div>
    <div class="col-xs-5 player-name"
      v-bind:class="getResultForPlayer(player2.wins, player1.wins)">
      <h1>{{ player2.name }}</h1>
      <h3>{{ player2.wins }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tournament'],

  data () {
    return {
      player1: {},
      player2: {}
    }
  },

  // Nechci se zabít
  mounted () {
    for (let x = 0; x < 2; x++) {
      let player = 'player' + (x + 1)

      let result = this.tournament.games.reduce((acc, game) => {
        if (!game.hasOwnProperty('winner')) { return acc }
        return (game.winner === this.tournament.players[x] ? ++acc : acc)
      }, 0)

      this[player] = {
        name: this.tournament.players[x],
        wins: result
      }
    }
  },

  // Co to kurva je? :)
  methods: {
    getResultForPlayer (player, enemy) {
      if (enemy > player) {
        return {lose: true}
      }

      if (enemy < player) {
        return {win: true}
      }
    }
  }
}
</script>


<style lang="sass">
  .player-name:first-child
    text-align: right

  .player-name.win
    text-shadow: 0px 0px 1px #5bc0de

  .player-name.lose
    text-shadow: 0px 0px 1px #f0ad4e
</style>
