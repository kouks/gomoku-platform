<template>
  <div class="col-md-6">
    <div class="tournament">
      <header>
        <tags :tournament="tournament"></tags>
        <result-board :tournament="tournament"></result-board>
      </header>
      <games :games="tournament.games"></games>
    </div>
  </div>
</template>

<script>

import Tags from '@/components/elements/Tags'
import Games from '@/components/elements/Games'
import ResultBoard from '@/components/elements/ResultBoard'

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
