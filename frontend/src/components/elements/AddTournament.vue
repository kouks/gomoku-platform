<template>
  <div>
      <transition name="slide-left">
        <div class="shade" v-if="show"> </div>
      </transition>

      <transition name="slide">
        <div class="side-panel" v-show="show">
          <transition name="fade">
            <div v-show="show">
              <div class="form-field heading">
                new tournament
              </div>

              <transition name="fade">
                <div v-show="url">
                  <div class="form-field">
                    <input
                      readonly
                      type="text"
                      id="copy-ws"
                      v-bind:value="url"
                      class="text-center"
                    >
                  </div>
                </div>
              </transition>

              <transition name="fade">
                <div v-show="! url">
                  <div class="form-field">
                    <input v-model="games" type="text" placeholder="number of games">
                  </div>
                  <div class="form-field">
                    <input v-model="player1" type="text" placeholder="player #1">
                  </div>
                  <div class="form-field">
                    <input v-model="player2" type="text" placeholder="player #2">
                  </div>
                </div>
              </transition>

              <div class="form-field">
                <button v-show="! url" class="submit" @click="create">create</button>
                <button v-show="url" class="submit" @click="copy">copy</button>
              </div>

              <div class="col-md-12 faq">
                <a href="/client">
                  <i class="fa fa-gamepad"></i>
                  Client
                  <p>Test your bot with our online client!</p>
                </a>
              </div>
              <div class="col-md-12 faq">
                <a href="/client">
                  <i class="fa fa-plug"></i>
                  Get started
                  <p>
                    How to connect to the server? What are the limitations?
                    How do the tournaments work? Find out more here!
                  </p>
                </a>
              </div>
              <div class="col-md-12 faq">
                <a href="/doc">
                  <i class="fa fa-book"></i>
                  Documentation
                  <p>
                    Learn more about message standards, events and scenarios.
                  </p>
                </a>
              </div>
              <div class="col-md-12 faq">
                <a href="https://github.com/kouks/gomoku-platform" target="_blank">
                  <i class="fa fa-code-fork"></i>
                  GitHub
                </a>
              </div>
              <div class="col-md-12 copy">
                Pavel Koch &amp; Michael Bausano &copy; 2017
              </div>
            </div>
          </transition>
        </div>
      </transition>

    <div class="add-tournament" @click="show = !show">
      <i class="fa" v-bind:class="{'fa-plus': !show, 'fa-minus': show, 'fa-spin': show}" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      show: false,
      games: '',
      player1: '',
      player2: '',
      url: false
    }
  },

  methods: {
    create () {
      let games = Math.floor(parseInt(this.games))

      // Validation loooooooooooooooooooooool.
      if (isNaN(games)) {
        console.log('rip')
        return
      }

      axios.post('http://localhost:3000/tournaments', {
        game_count: games
      }).then((response) => {
        this.url = response.data.url
      }).catch((error) => {
        console.error(error.message)
      })

      this.games = ''
    },

    copy () {
      document.getElementById('copy-ws').select()

      document.execCommand('copy')
    }
  }
}
</script>
