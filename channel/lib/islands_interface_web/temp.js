var phoenix = require("phoenix")
var socket = new phoenix.Socket("/socket", {})
socket.connect()

function new_channel(subtopic, screen_name) {
  return socket.channel("game:" + subtopic, {screen_name: screen_name});
}

var game_channel = new_channel("moon", "moon")

function join(channel) { channel.join()
  .receive("ok", response => {
  console.log("Joined successfully!", response)
  })
  .receive("error", response => {
  console.log("Unable to join", response) })
}

function leave(channel) { channel.leave()
  .receive("ok", response => {
  console.log("Left successfully", response)
  })
  .receive("error", response => {
  console.log("Unable to leave", response) })
}
