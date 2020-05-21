function load(setDirection, prevDir) {
    var interval;
    if (!('ongamepadconnected' in window)) {
        interval = setInterval(pollGamepads, 250)
    }
    function pollGamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        var gp = gamepads[0];
        //Add logic not to go back on its self and analogue
        if (gp) {
            if (!prevDir)
                return
            if (gp.buttons[13].pressed || gp.axes[1] > 0.5) {
                if (prevDir.current !== "up")
                    setDirection("down")
            } else
                if (gp.buttons[15].pressed || gp.axes[0] > 0.5) {
                    if (prevDir.current !== "left")
                        setDirection("right")
                } else
                    if (gp.buttons[12].pressed || gp.axes[1] < -0.5) {
                        if (prevDir.current !== "down")
                            setDirection("up")
                    } else
                        if (gp.buttons[14].pressed || gp.axes[0] < -0.5) {
                            if (prevDir.current !== "right")
                                setDirection("left")
                        }

            clearInterval(interval);
        }
    }
}


module.exports = {
    load: load,
}
