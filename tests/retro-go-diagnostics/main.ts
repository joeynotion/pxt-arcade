const DIAG_VERSION = "RGD-0.1"
let frame = 0
let playerX = 80
let playerY = 62
let aCount = 0
let bCount = 0
let menuCount = 0
let pulse = 0
let status = "OK"
let lastEvent = "boot"

music.setVolume(80)
console.log("RGDIAG boot " + DIAG_VERSION)

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    aCount += 1
    pulse = 18
    lastEvent = "A"
    console.log("RGDIAG A " + aCount)
    music.playTone(523, 80)
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    bCount += 1
    pulse = 18
    lastEvent = "B"
    console.log("RGDIAG B " + bCount)
    music.playTone(784, 80)
})

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    menuCount += 1
    pulse = 18
    lastEvent = "MENU"
    console.log("RGDIAG MENU " + menuCount)
})

game.onUpdate(function () {
    frame += 1

    if (controller.left.isPressed()) {
        playerX -= 1
    }
    if (controller.right.isPressed()) {
        playerX += 1
    }
    if (controller.up.isPressed()) {
        playerY -= 1
    }
    if (controller.down.isPressed()) {
        playerY += 1
    }

    if (playerX < 72) playerX = 72
    if (playerX > 150) playerX = 150
    if (playerY < 50) playerY = 50
    if (playerY > 95) playerY = 95

    if (pulse > 0) {
        pulse -= 1
    }

    if (frame % 120 == 0) {
        console.log("RGDIAG frame " + frame + " x " + playerX + " y " + playerY)
    }
})

game.onPaint(function () {
    screen.fill(15)

    screen.print("Retro-Go Arcade Diag", 2, 2, 1)
    screen.print("ver " + DIAG_VERSION, 2, 12, 5)
    screen.print("frm " + frame, 2, 22, 1)
    screen.print("ms " + game.runtime(), 72, 22, 1)
    screen.print("xy " + playerX + "," + playerY, 2, 32, 1)
    screen.print("A" + aCount + " B" + bCount + " M" + menuCount, 72, 32, 1)

    drawButtonState("U", controller.up.isPressed(), 2, 47)
    drawButtonState("D", controller.down.isPressed(), 24, 47)
    drawButtonState("L", controller.left.isPressed(), 46, 47)
    drawButtonState("R", controller.right.isPressed(), 2, 60)
    drawButtonState("A", controller.A.isPressed(), 24, 60)
    drawButtonState("B", controller.B.isPressed(), 46, 60)
    drawButtonState("M", controller.menu.isPressed(), 2, 73)

    screen.drawRect(68, 47, 88, 52, 1)
    screen.print("move box", 75, 50, 5)
    screen.drawLine(72, 75, 152, 75, 5)
    screen.drawLine(112, 50, 112, 96, 5)
    screen.fillRect(playerX - 3, playerY - 3, 7, 7, pulse > 0 ? 10 : 9)
    screen.drawRect(playerX - 5, playerY - 5, 11, 11, pulse > 0 ? 2 : 1)

    drawHeartbeat()
    drawColorBars()

    screen.print("last " + lastEvent, 72, 98, 1)
    screen.print("status " + status, 2, 112, status == "OK" ? 7 : 2)
})

function drawButtonState(id: string, pressed: boolean, x: number, y: number) {
    screen.fillRect(x, y, 20, 10, pressed ? 7 : 1)
    screen.drawRect(x, y, 20, 10, pressed ? 2 : 5)
    screen.print(id, x + 6, y + 2, 15)
}

function drawHeartbeat() {
    if (frame % 60 < 30) {
        screen.fillRect(145, 4, 8, 8, 2)
    } else {
        screen.drawRect(145, 4, 8, 8, 2)
    }
}

function drawColorBars() {
    for (let i = 1; i < 16; i++) {
        screen.fillRect((i - 1) * 10, 102, 10, 8, i)
    }
}
