# Retro-Go System Menu Smoke

This fixture verifies a built-in Arcade system menu open/close cycle.

Behavior:

- boot 1 calls `scene.systemMenu.showSystemMenu()` after a short delay
- the headless harness presses `B` to close the menu
- once the menu has been seen and closed, the fixture resets
- boot 2 remains running

The headless Retro-Go harness should observe at least one VM reset and no panic.
