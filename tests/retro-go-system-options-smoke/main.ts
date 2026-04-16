const VERSION = "RGSO-0.2"

let frame = 0
let directOpenCount = 0

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    directOpenCount += 1
    scene.systemMenu.showSystemMenu()
})

game.onUpdate(function () {
    frame += 1
})

game.onPaint(function () {
    screen.fill(15)
    screen.print("Retro-Go SysOptions", 2, 2, 1)
    screen.print("ver " + VERSION, 2, 12, 5)
    screen.print("frame " + frame, 2, 24, 1)
    screen.print("direct A " + directOpenCount, 2, 36, directOpenCount > 0 ? 7 : 2)
    screen.print("A = direct open", 2, 52, 1)
    screen.print("Menu = system options", 2, 64, 1)
    screen.print("same menu expected", 2, 76, 1)
    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
})
