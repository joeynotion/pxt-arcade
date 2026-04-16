const VERSION = "RGGL-0.1"
const GAMEOVER_DELAY_MS = 600
const TARGET_BOOTS = 3
const SETTINGS_KEY = "rg-gameover-loop-boots"

let frame = 0
let gameOverTriggered = false
let bootCount = settings.readNumber(SETTINGS_KEY) || 0

bootCount += 1
if (bootCount >= TARGET_BOOTS) {
    settings.remove(SETTINGS_KEY)
} else {
    settings.writeNumber(SETTINGS_KEY, bootCount)
}

console.log("RGGAMEOVERLOOP boot " + bootCount)

game.onUpdate(function () {
    frame += 1
    if (bootCount < TARGET_BOOTS && !gameOverTriggered && game.runtime() >= GAMEOVER_DELAY_MS) {
        gameOverTriggered = true
        console.log("RGGAMEOVERLOOP trigger " + bootCount)
        game.over(false, effects.dissolve)
    }
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go GO Loop", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("boot " + bootCount + "/" + TARGET_BOOTS, 2, 36, bootCount >= TARGET_BOOTS ? 7 : 1)
    screen.print("runtime " + game.runtime(), 2, 48, 1)
    screen.print(gameOverTriggered ? "game over" : "running", 2, 60, gameOverTriggered ? 2 : 7)
    screen.print(bootCount >= TARGET_BOOTS ? "done" : "await retry", 2, 72, bootCount >= TARGET_BOOTS ? 7 : 2)

    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
