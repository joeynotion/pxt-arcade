const VERSION = "RGS-0.1"
const SETTINGS_KEY = "rg-settings-smoke-count"
const RESET_DELAY_MS = 700

let frame = 0
let value = settings.readNumber(SETTINGS_KEY) || 0
let resetTriggered = false

value += 1
settings.writeNumber(SETTINGS_KEY, value)
console.log("RGSETTINGS boot " + value)

game.onUpdate(function () {
    frame += 1
    if (!resetTriggered && value < 2 && game.runtime() >= RESET_DELAY_MS) {
        resetTriggered = true
        console.log("RGSETTINGS reset " + value)
        control.reset()
    }
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go Settings", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("value " + value, 2, 36, value >= 2 ? 7 : 2)
    screen.print(resetTriggered ? "resetting" : "running", 2, 48, resetTriggered ? 2 : 7)
    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
