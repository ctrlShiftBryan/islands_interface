var phoenix = require("phoenix")
var socket = new phoenix.Socket("/socket", {})
socket.connect()

function new_channel(subtopic, screen_name) {
  return socket.channel("game:" + subtopic, {screen_name: screen_name});
}

var game_channel = new_channel("moon", "diva")

function join(channel) { channel.join()
  .receive("ok", response => {
  console.log("Joined successfully!", response)
  })
  .receive("error", response => {
  console.log("Unable to join", response) })
}

join(game_channel)

function leave(channel) { channel.leave()
  .receive("ok", response => {
  console.log("Left successfully", response)
  })
  .receive("error", response => {
  console.log("Unable to leave", response) })
}



 function say_hello(channel, greeting) { 
   channel
   .push("hello", {"message": greeting})
   .receive("ok", response => { console.log("Hello", response.message) })
   .receive("error", response => {
      console.log("Unable to say hello to the channel.", response.message)
    })
  }

game_channel.on("said_hello", response => { console.log("Returned Greeting:", response.message)})

function new_game(channel) { 
  channel.push("new_game").receive("ok", response => { console.log("New Game!", response)
}).receive("error", response => {
  console.log("Unable to start a new game.", response) })
}


function add_player(channel, player) { 
  channel.push("add_player", player).receive("error", response => { console.log("Unable to add new player: " + player, response) }) 
}

game_channel.on("player_added", response => { console.log("Player Added", response) })

add_player(game_channel, "diva")

function position_island(channel, player, island, row, col) {
  var params = {"player": player, "island": island, "row": row, "col": col} 
  channel.push("position_island", params)
  .receive("ok", response => { console.log("Island positioned!", response) })
  .receive("error", response => { console.log("Unable to position island.", response) })
}


position_island(game_channel, "player2", "atoll", 1, 1)
position_island(game_channel, "player2", "dot", 1, 5);
position_island(game_channel, "player2", "l_shape", 1, 7);
position_island(game_channel, "player2", "s_shape", 5, 1);
position_island(game_channel, "player2", "square", 5, 5);
position_island(game_channel, "player1", "dot", 1, 1);


function set_islands(channel, player) { 
  channel.push("set_islands", player).receive("ok", response => { console.log("Here is the board:"); console.dir(response.board);
})
.receive("error", response => {
console.log("Unable to set islands for: " + player, response) })
}

game_channel.on("player_set_islands", response => { console.log("Player Set Islands", response) })

function guess_coordinate(channel, player, row, col) { 
  var params = {"player": player, "row": row, "col": col} 
  channel.push("guess_coordinate", params).receive("error", response => { console.log("Unable to guess a coordinate: " + player, response) }) 
}

game_channel.on("player_guessed_coordinate", response => { console.log("Player Guessed Coordinate: ", response.result) })
