<template>
  <div>
    <div class="tags">
      <ol class="breadcrumb">
        <li v-html="finished()"></li>
        <li>
          <span class="label label-info">
            {{ tournament.games.length }}
            games
          </span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tournament'],

  data () {
    return { }
  },

  methods: {
    finished () {
      let result = this.tournament.games.reduce((acc, game) => {
        return (game.hasOwnProperty('winner') ? ++acc : acc)
      }, 0)

      if (result === this.tournament.games.length) {
        return '<span class="label label-success">Finished</span>'
      }

      return '<span class="label label-warning">In Progress</span>'
    }
  }
}
</script>
