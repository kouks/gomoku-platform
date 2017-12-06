<template>
  <div>
      <transition name="slide-left">
        <div class="popup" v-if="show"> </div>
      </transition>

      <transition name="slide">
        <div class="side-panel" v-if="show">
          <div class="col-md-12">
            <input type="text" class="text" placeholder="Number of games">
          </div>
          <div class="col-md-12">
            <input type="text" class="text" placeholder="Player #1">
          </div>
          <div class="col-md-12">
            <input type="text" class="text" placeholder="Player #2">
          </div>
          <div class="col-md-12">
            <button class="submit">Add new tournament</button>
          </div>
        </div>
      </transition>

    <div class="add-tournament" @click="show = !show">
      <i class="fa" v-bind:class="{'fa-plus': !show, 'fa-minus': show}" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  data () {
    return {
      show: false
    }
  },

  methods: {

  }
}
</script>
