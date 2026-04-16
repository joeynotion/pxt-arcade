const VERSION = "RGGO-0.1"
const GAMEOVER_DELAY_MS = 600
let frame = 0
let gameOverTriggered = false

console.log("RGGAMEOVER boot")

game.onUpdate(function () {
    frame += 1
    if (!gameOverTriggered && game.runtime() >= GAMEOVER_DELAY_MS) {
        gameOverTriggered = true
        console.log("RGGAMEOVER trigger")
        game.over(false, effects.dissolve)
    }
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go GameOver", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("runtime " + game.runtime(), 2, 36, 1)
    screen.print("status", 2, 52, 1)
    screen.print(gameOverTriggered ? "game over" : "running", 2, 62, gameOverTriggered ? 2 : 7)
    screen.print("delay " + GAMEOVER_DELAY_MS, 2, 74, 1)

    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
