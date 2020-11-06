function load(updateFieldChanged, playerSnakeArrayRef, playerRef, socket) {
  var interval;
  if (!("ongamepadconnected" in window)) {
    interval = setInterval(pollGamepads, 10);
  }
  function pollGamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    var gp = gamepads[0];
    let snake = playerSnakeArrayRef.current.find(
      (x) => x.playerId == playerRef.current
    );
    if (gp) {
      if (!snake) {
        clearInterval(interval);
        return;
      }
      if (gp.buttons[13].pressed || gp.axes[1] > 0.5) {
        if (snake.direction !== "up") {
          updateFieldChanged(snake.playerId, "direction", "down");
          if(socket)
          socket.emit("playerKeyEvent", {
            playerId: snake.playerId,
            direction: "down",
          });
        }
      } else if (gp.buttons[15].pressed || gp.axes[0] > 0.5) {
        if (snake.direction !== "left") {
          updateFieldChanged(snake.playerId, "direction", "right");
          if(socket)
          socket.emit("playerKeyEvent", {
            playerId: snake.playerId,
            direction: "right",
          });
        }
      } else if (gp.buttons[12].pressed || gp.axes[1] < -0.5) {
        if (snake.direction !== "down") {
          updateFieldChanged(snake.playerId, "direction", "up");
          if(socket)
          socket.emit("playerKeyEvent", {
            playerId: snake.playerId,
            direction: "up",
          });
        }
      } else if (gp.buttons[14].pressed || gp.axes[0] < -0.5) {
        if (snake.direction !== "right") {
          updateFieldChanged(snake.playerId, "direction", "left");
          if(socket)
          socket.emit("playerKeyEvent", {
            playerId: snake.playerId,
            direction: "left",
          });
        }
      }

      if (gp.buttons[7].pressed) {
        if(socket && snake.status == "gun")
        socket.emit("powerExecute", {
          playerId: snake.playerId,
          status: "fireBullet",
        });
      }
    }
  }
}

module.exports = {
  load: load,
};
