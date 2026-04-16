const VERSION = "RGM-0.1"
let frame = 0
let menuCount = 0

console.log("RGMENU boot")

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    menuCount += 1
    console.log("RGMENU menu " + menuCount)
    control.reset()
})

game.onUpdate(function () {
    frame += 1
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go Menu Smoke", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("menu " + menuCount, 2, 36, menuCount > 0 ? 7 : 2)
    screen.print("press menu to reset", 2, 52, 1)

    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
