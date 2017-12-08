<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        asd
      </div>

      <div class="col-md-8 col-md-offset-1">
        <h1>Documentation</h1>
        <ol>
          <li>Event Structure</li>
          <li>Event Chain</li>
          <li>Errors and Rules</li>
        </ol>

        <h2>Event Structure</h2>
        <p>Each event has a compulsory field <code>type</code> that specifies the type of the event. Other fields may vary
        based on the event type.</p>

        <h2>Event Chain</h2>
        <p>Upon connecting to the web socket server, you will receive the plain <code>hello</code> event.</p>
        <pre>{
  "type": "hello"
}</pre>
        <p>After sending this event, the server awaits for 2 players to join the lobby. Now is the time that the bot
        is supposed to send a <code>ready</code> event with the <code>name</code> field.</p>
        <pre>{
  "type": "ready",
  "name": "amazing-gomoku-bot 1.0"
}</pre>
        <blockquote>Not that the server sends an immediate response to each of the client events. The format is either
          <ul>
            <li><code>{ "ok": true }</code> upon success,</li>
            <li>or <code>{ "ok": false, "error": "error_type" }</code> upon failure.</li>
          </ul>
        </blockquote>

        <p>As soon as the server receives the <code>ready</code> event from <strong>two</strong> bots, it sends the
          <code>new_game</code> event to both players. This event also includes the side that the player is playing for
         - either <code>o</code> or <code>x</code>.</p>
        <pre>{
  "type": "new_game",
  "side": "x/o"
}</pre>
        <p>At the same time, it automatically determines the move order for both players and sends a <code>your_move</code>
        event to the player whose turn it currently is. Data about the game is attached to the event.</p>
        <pre>{
  "type": "your_move",
  "state": [ ["-", "o", "x", ... ] ... ], // 20x20 array containing strings "-", "o" or "x"
  "moves": [
    {
      "x": 1,
      "y": 1,
      "side": "x"
    }
  ]
}</pre>
        <p>The player is now requested to send a <code>move</code> event, containing the data about the move chosen
        by the bot.</p>
        <pre>{
  "type": "move",
  "move: {
    "x": 1,
    "y": 2
  }
}</pre>
        <p>After each <code>move</code> event, the server responds with one of the following:</p>
        <ol>
          <li><code>your_move</code> event to the other player</li>
          <li><code>game_over</code> event to both players if the game is over, requesting another
            <code>ready</code> event form both bots</li>
          <li><code>tournament_over</code> event to both players, ending the tournament and closing the web socket server</li>
        </ol>

        <h2>Errors and Rules</h2>
        <p>Every move that a player makes needs to follow certain rules, we will go through all of the errors that you can
          get as a response.</p>
        <ul>
          <li><code>invalid_message_format</code> the format of your event is not valid.</li>
          <li><code>too_many_players</code> there are already two players present in the tournament.</li>
          <li><code>not_your_move</code> the bots sends a <code>move</code> event when it is not its turn,
            <strong>resulting in disqualification of the bot from the current game.</strong></li>
          <li><code>move_out_of_bounds</code> the bots sends a <code>move</code> event where the x or y coordinate is not
            withing the 20x20 board boundaries, <strong>resulting in disqualification of the bot from the current game.</strong></li>
          <li><code>invalid_move</code> the bots sends a <code>move</code> event where the x and y coordinates are already taken
            <strong>resulting in disqualification of the bot from the current game.</strong></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //
}
</script>
