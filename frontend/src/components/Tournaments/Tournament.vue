<template>
  <div class="col-md-6">
    <div class="tournament">
      <header>
        <tags :tournament="tournament"></tags>
        <result-board :tournament="tournament"></result-board>
      </header>
      <games :games="tournament.games" :players="tournament.players"></games>
    </div>
  </div>
</template>

<script>

import Tags from '@/components/Tournaments/Partials/Tags'
import Games from '@/components/Tournaments/Partials/Games'
import ResultBoard from '@/components/Tournaments/Partials/ResultBoard'

export default {
  props: ['tournament'],

  components: {
    Tags,
    Games,
    ResultBoard
  },

  data () {
    return { }
  }
}
</script>
