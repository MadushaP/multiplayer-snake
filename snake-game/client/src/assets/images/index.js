const SnakeHeadGreen = require('./snake-head.png')
const SnakeHeadBlue = require('./snake-head-5CFFE7.png')
const SnakeHeadRed = require('./snake-head-C70039.png')
const SnakeHeadCream = require('./snake-head-DAF7A6.png')
const SnakeHeadGrey = require('./snake-head-DEDEDE.png')
const SnakeHeadYellow = require('./snake-head-FFC300.png')
const SnakeHeadEatGreen = require('./snake-head-eat.png')
const SnakeHeadEatBlue = require('./snake-head-eat-5CFFE7.png')
const SnakeHeadEatRed = require('./snake-head-eat-C70039.png')
const SnakeHeadEatCream = require('./snake-head-eat-DAF7A6.png')
const SnakeHeadEatGrey = require('./snake-head-eat-DEDEDE.png')
const SnakeHeadEatYellow = require('./snake-head-eat-FFC300.png')

export const SnakeImage = {
    closedMouthColour: {
        "green": SnakeHeadGreen,
        "blue": SnakeHeadBlue,
        "red": SnakeHeadRed,
        "cream": SnakeHeadCream,
        "grey": SnakeHeadGrey,
        "yellow": SnakeHeadYellow
    },
    openMouthColour: {
        "green": SnakeHeadEatGreen,
        "blue": SnakeHeadEatBlue,
        "red": SnakeHeadEatRed,
        "cream": SnakeHeadEatCream,
        "grey": SnakeHeadEatGrey,
        "yellow": SnakeHeadEatYellow
    }
}

const Freeze = require('./freeze.png')
const Gun = require('./gun.png')
const Bullet = require('./bullet-head.png')
const BulletFlare = require('./gun-flare.png')

export const Powers = {
    "freeze": Freeze,
    "gun": Gun,
    "bullet": Bullet,
    "flare": BulletFlare
}

