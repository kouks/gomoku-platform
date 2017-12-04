<template>
  <div class="games">
    <div class="col-md-3 list">
      <div v-for="(game, key) in games" :key="key">
        Game #{{ key + 1 }}
      </div>
    </div>
    <div class="col-md-9 text-center game-canvas">
      <game :game="games[0]"></game>
    </div>
  </div>
</template>

<script>
import Game from '@/components/elements/Game'

export default {
  components: {
    Game
  },

  props: ['games'],

  data () {
    return { }
  }
}
</script>
