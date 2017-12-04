<template>
  <div>
    <tournament
      :key="key"
      :tournament="tournament"
      v-for="(tournament, key) in tournaments"
    ></tournament>
  </div>
</template>

<script>
import axios from 'axios'

import Tournament from '@/components/Tournament'

export default {
  components: {
    Tournament
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
