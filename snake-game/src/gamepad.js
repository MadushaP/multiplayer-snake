function load(setDirection) {
    var interval;
    if (!('ongamepadconnected' in window)) {
        interval = setInterval(pollGamepads, 250)
    }
    function pollGamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        var gp = gamepads[0];
        //Add logic not to go back on its self and analogue
        if (gp) {
            if (gp.buttons[13].pressed) {
                setDirection("down")
            }
            if (gp.buttons[15].pressed) {
                setDirection("right")
            }
            if (gp.buttons[12].pressed) {
                setDirection("up")
            }
            if (gp.buttons[14].pressed) {
                setDirection("left")
            }

            clearInterval(interval);
        }
    }
}


module.exports = {
    load: load,
}
