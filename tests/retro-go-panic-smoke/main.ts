const VERSION = "RGP-0.1"
const PANIC_CODE = 321
const PANIC_DELAY_MS = 700

let frame = 0
let panicTriggered = false

console.log("RGPANIC boot")

game.onUpdate(function () {
    frame += 1
    if (!panicTriggered && game.runtime() >= PANIC_DELAY_MS) {
        panicTriggered = true
        console.log("RGPANIC trigger " + PANIC_CODE)
        control.panic(PANIC_CODE)
    }
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go Panic", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("panic " + PANIC_CODE, 2, 36, 2)
    screen.print(panicTriggered ? "triggered" : "waiting", 2, 48, panicTriggered ? 2 : 7)
    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
