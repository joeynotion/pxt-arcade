const VERSION = "RGSM-0.1"
const SETTINGS_KEY = "rg-system-menu-smoke-boot"
const OPEN_DELAY_MS = 600

let frame = 0
let boot = settings.readNumber(SETTINGS_KEY) || 0
let opened = false
let visibleSeen = false
let closed = false

boot += 1
settings.writeNumber(SETTINGS_KEY, boot)
console.log("RGSYSMENU boot " + boot)

game.onUpdate(function () {
    frame += 1

    if (boot < 2 && !opened && game.runtime() >= OPEN_DELAY_MS) {
        opened = true
        console.log("RGSYSMENU open")
        scene.systemMenu.showSystemMenu()
    }

    if (scene.systemMenu.isVisible()) {
        visibleSeen = true
    } else if (boot < 2 && visibleSeen && !closed) {
        closed = true
        console.log("RGSYSMENU closed")
        control.reset()
    }
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go SysMenu", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("boot " + boot, 2, 36, boot >= 2 ? 7 : 2)
    screen.print(opened ? "opened" : "waiting", 2, 48, opened ? 7 : 2)
    screen.print(visibleSeen ? "visible seen" : "not visible", 2, 60, visibleSeen ? 7 : 2)
    screen.print(closed ? "closed" : "open/idle", 2, 72, closed ? 7 : 2)
    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
