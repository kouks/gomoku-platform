<template>
  <div>
    <div>
      <ol class="breadcrumb">
        <li><a href="/">Home</a></li>
        <li class="active">Documentation</li>
      </ol>
    </div>
    <div class="container">
      <div class="col-md-12">
        <h1>Documentation</h1>
        <ol>
          <li>Event Structure</li>
          <li>Event Chain</li>
          <li>Errors and Rules</li>
        </ol>

        <h2>Event Structure</h2>
        <p>Each event has a compulsory field <code>type</code> that specifies the type of an event. Other fields may vary
        based on the event type.</p>

        <h2>Event Chain</h2>
        <p>Upon connecting to the web socket server, you will receive a plain <code>hello</code> event.</p>
        <pre>{
  "type": "hello"
}</pre>
        <p>
          Before a tournament starts, server waits for 2 ready events. One from you and one your opponent.
          Every <code>ready</code> event should contain a <code>name</code> field:
        </p>
        <pre>{
  "type": "ready",
  "name": "amazing-gomoku-bot 1.0"
}</pre>
        <blockquote>Note that the server sends an immediate response to both clients. The format is either
          <ul>
            <li><code>{ "ok": true }</code> upon success,</li>
            <li>or <code>{ "ok": false, "error": "error_type" }</code> upon failure.</li>
          </ul>
        </blockquote>

        <p>As soon as the server receives <code>ready</code> event from <strong>two</strong> clients, it sends a
          <code>new_game</code> event to both of them. This event also includes the side that a player is playing for
         - either <code>o</code> or <code>x</code>.</p>
        <pre>{
  "type": "new_game",
  "side": "x/o"
}</pre>
        <p>At the same time, it automatically determines the move order for both players and sends a <code>your_move</code>
        event to the player whose turn it currently is. Data about the game is attached to the message.</p>
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
        <p>The client is now requested to send a <code>move</code> event containing data about a move played</p>
        <pre>{
  "type": "move",
  "move: {
    "x": 1,
    "y": 2
  }
}</pre>
        <p>After each <code>move</code> event, the server dispatches one of following:</p>
        <ol>
          <li><code>your_move</code> event to the other player</li>
          <li><code>game_over</code> event to both players saying that the game is over, requesting <b>another</b>
            <code>ready</code> event form both bots</li>
          <li><code>tournament_over</code> event to both players, ending the tournament and closing the web socket</li>
        </ol>

        <h2>Errors</h2>
        <p>Every move that a player makes needs to follow certain rules. Let's go through all of the errors that you can occur as a response.</p>
        <ul>
          <li><code>invalid_json</code> your message isn't valid jSON</li>
          <li><code>invalid_event</code> the event you sent doesn't exist</li>
          <li><code>invalid_message_format</code> the format of your event is not valid</li>
          <li><code>too_many_players</code> there are already two players present in the tournament</li>
          <li><code>not_your_move</code> a client sent a <code>move</code> event when it is not his turn,
            <strong>resulting in disqualification of the bot from the current game</strong></li>
          <li><code>move_out_of_bounds</code> a client sent a <code>move</code> event where the x or y coordinate is not
            withing the 20x20 board boundaries, <strong>resulting in disqualification of the bot from the current game</strong></li>
          <li><code>invalid_move</code> a client sent a <code>move</code> event where the <code>[ x : y ]</code> field already contains a <i>piece</i>.
            <strong>resulting in disqualification of the bot from the current game</strong></li>
        </ul>
        <pre>{
  "ok":false
  "error":"invalid_message_format"
}</pre>
      <h2>Rules</h2>
      <p>
        We are playing on a 20x20 board. Each field has a coords <code>[ x : y ]</code>
        where both <b>x</b> and <b>y</b> are integers in interval <code>< 0 ; 19 ></code>.
      </p>
      <ul>
        <li>Each tournament has N games.</li>
        <li>The tournament is not finished until all games have been played.</li>
        <li>The winner is a player with more wins.</li>
        <li>A win in a game gets player who connects five <i>pieces</i> in a row either horizontally, verticaly or diagonally.</li>
        <li>If players move results in one of <i>lethal</i> errors, he loses and the server goes for next game (if there is any scheduled).</li>
      </ul>
      <p>
        At the moment there is no time threshold for a move. If this proves as impractical, we might set the threshold on <b>15 seconds</b>.
        Please keep this in mind whilst designing your bots.
      </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //
}
</script>
