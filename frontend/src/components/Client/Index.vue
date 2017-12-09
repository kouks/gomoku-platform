<template>
  <div>
    <div>
      <ol class="breadcrumb">
        <li><a href="/">Home</a></li>
        <li class="active">Client</li>
      </ol>
    </div>
    <div class="container">
      <div class="col-md-12">
        <div v-if="tournament_over">
          <p>Tournament is over. You can have a look on the results <a href="/">here</a>.</p>
          <p>Also feel free to play another one.</p>
        </div>

        <div v-if="! socket">
          <input type="text" v-model="name" placeholder="Your name" class="wtf">
          <input type="text" v-model="url" placeholder="Web Socket server url" class="wtf">
          <button type="button" @click="connect">Connect</button>
        </div>

        <div v-if="socket" class="text-center">
          <p v-if="your_move">Your move</p>
          <p v-else>Waiting for opponents move ...</p>

          <div class="canvas">
            <div class="canvas-row" v-for="(row, x) in state" :key="x">
              <div
                :key="y"
                class="canvas-cell"
                v-for="(cell, y) in row"
                @click="move(x, y)">
                  <i class="fa" v-bind:class="getIcon(cell)" aria-hidden="true"></i>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      name: '',
      socket: null,
      side: null,
      state: [],
      your_move: false
    }
  },

  methods: {
    connect () {
      this.tournament_over = false

      try {
        this.socket = new window.WebSocket(this.url)

        this.socket.onmessage = (event) => {
          this.message(JSON.parse(event.data))
        }
      } catch (e) {
        console.error(e)
      }
    },

    send (msg) {
      console.log('sending', msg)
      this.socket.send(JSON.stringify(msg))
    },

    message (event) {
      console.log(event)

      if (event.ok) { return }

      switch (event.type) {
        case 'hello':
        case 'game_over':
          this.send({
            type: 'ready',
            name: this.name
          })
          break

        case 'new_game':
          this.newGame(event.side)
          break

        case 'your_move':
          this.your_move = true
          this.state = event.state
          break

        case 'tournament_over':
          this.socket = null
          this.your_move = false
          this.url = ''
          this.tournament_over = true
          this.side = null
          this.state = []
          break

        default:
          console.error('This event doesn\'t exist', event)
      }
    },

    move (x, y) {
      if (!this.your_move) {
        return
      }

      this.your_move = false

      this.state[x][y] = this.side

      this.$forceUpdate()

      this.send({
        type: 'move',
        move: {
          x: x,
          y: y
        }
      })
    },

    newGame (side) {
      this.state = (new Array(20)).fill('-').map((row) => {
        return (new Array(20)).fill('-')
      })

      if (side) {
        this.side = side
      }
    },

    getIcon (type) {
      if (type === '-') {
        return {}
      }

      let style = {}

      if (type === 'x') {
        style['fa-times'] = true
      } else {
        style['fa-circle-o-notch'] = true
      }

      if (type === this.side) {
        style['red'] = true
      } else {
        style['blue'] = true
      }

      return style
    }
  }
}
</script>

<style lang="sass">
input[type="text"], button
  padding: 15px 8px
  color: black
  border: none
  width: 100%
  background: white
  outline: none
  transition: .3s background ease, .3s border-left ease

  &::placeholder
    color: #bbb

input[type="text"]:hover, input[type="text"]:focus
    background: #fafafa
    border-left: 3px solid #31708f

button
  background: #f6f9fa
  margin-bottom: 40px
  transition: .2s letter-spacing ease

  &:hover, &:focus
    letter-spacing: 1px

.canvas
  margin: auto
  background: #f5f5f5
  width: 600px
  height: 600px

.canvas-row
  width: 100%
  overflow: hidden
  height: 30px
  box-sizing: border-box

  & .canvas-cell
    height: 30px
    width: 30px
    overflow: hidden
    box-sizing: border-box
    display: inline-block
    border-bottom: 1px solid #f0f0f0
    border-left: 1px solid #f0f0f0
    text-align: center

    & i
      font-size: 21px
      padding-top: 5px

      &.red
        color: red

      &.blue
        color: #31708f
</style>
