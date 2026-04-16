const VERSION = "RGA-0.1"
const SETTINGS_KEY = "rg-audio-smoke-boot"

let frame = 0
let boot = settings.readNumber(SETTINGS_KEY) || 0
let started = false

boot += 1
settings.writeNumber(SETTINGS_KEY, boot)
console.log("RGAUDIO boot " + boot)

control.runInParallel(function () {
    if (started) return
    started = true
    music.setVolume(96)
    music.playTone(262, 120)
    pause(80)
    music.playTone(330, 120)
    pause(80)
    music.playTone(392, 180)
    pause(120)
    console.log("RGAUDIO reset " + boot)
    if (boot < 2) control.reset()
})

game.onUpdate(function () {
    frame += 1
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go Audio", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("boot " + boot, 2, 36, boot >= 2 ? 7 : 2)
    screen.print(started ? "tones queued" : "idle", 2, 48, started ? 7 : 2)
    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
