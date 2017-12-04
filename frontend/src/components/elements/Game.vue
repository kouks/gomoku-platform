<template>
  <div class="game text-center">
    <div class="col-md-12">
      <div class="canvas"></div>
    </div>
    <div class="col-md-12">
      <div class="controls">
        <div>
          <i class="fa fa-angle-double-left" aria-hidden="true"></i>
        </div>
        <div>
          <i class="fa fa-play" aria-hidden="true"></i>
        </div>
        <div>
          <i class="fa fa-angle-double-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['game'],

  data () {
    return { }
  }
}
</script>

<style lang="sass">
  $canvas-size: 320px
  $controls-height: 40px

  .game
    height: calc($canvas-size + $controls-height)
    overflow-x: hidden
    overflow-y: auto

    & .canvas
      margin: auto
      height: $canvas-size
      width: $canvas-size
      background-color: #eee

    & .controls
      margin: auto
      height: $controls-height
      width: $canvas-size
      display: flex
      border: 1px solid #ddd
      border-radius: 3px
      border-top: 0

      & div
        flex: 1
        line-height: $controls-height
        cursor: pointer

        &:hover
          background-color: #eee
</style>
