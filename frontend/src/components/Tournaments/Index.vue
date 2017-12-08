<template>
  <div>
    <div class="container-fluid tournaments">
      <div class="row">
        <tournament
          :key="key"
          :tournament="tournament"
          v-for="(tournament, key) in tournaments"
        ></tournament>
      </div>
    </div>

    <new-tournament></new-tournament>
  </div>
</template>

<script>
import axios from 'axios'
import NewTournament from './New'
import Tournament from './Tournament'

export default {
  components: {
    Tournament,
    NewTournament
  },

  data () {
    return {
      tournaments: []
    }
  },

  mounted () {
    this.loadTournaments()
  },

  methods: {
    loadTournaments () {
      axios.get('http://localhost:3000/tournaments').then((response) => {
        this.tournaments = response.data
      }).catch((error) => {
        console.error(error.message)
      })
    }
  }
}
</script>
