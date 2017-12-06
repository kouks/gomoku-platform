<template>
  <div>
    <add-tournament></add-tournament>

    <div class="container-fluid tournaments">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AddTournament from '@/components/elements/AddTournament'

export default {
  components: {
    AddTournament
  }
}
</script>

<style lang="sass">
  @import assets/sass/app
</style>
