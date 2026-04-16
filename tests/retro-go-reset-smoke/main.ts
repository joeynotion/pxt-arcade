const VERSION = "RGR-0.1"
const RESET_DELAY_MS = 600
let resetArmed = true
let frame = 0

console.log("RGRESET boot")

game.onUpdate(function () {
    frame += 1
    if (resetArmed && game.runtime() >= RESET_DELAY_MS) {
        resetArmed = false
        console.log("RGRESET reset")
        control.reset()
    }
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go Reset Smoke", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("runtime " + game.runtime(), 2, 36, 1)
    screen.print("status", 2, 52, 1)
    screen.print(resetArmed ? "reset pending" : "reset requested", 2, 62, resetArmed ? 2 : 7)
    screen.print("delay " + RESET_DELAY_MS, 2, 74, 1)

    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
