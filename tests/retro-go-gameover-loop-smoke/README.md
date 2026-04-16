# Retro-Go Game Over Loop Smoke

This fixture deterministically exercises multiple `game.over()` retry cycles.

Behavior:

- boot 1 triggers `game.over()` after a short delay
- boot 2 triggers `game.over()` again after a short delay
- boot 3 stops triggering `game.over()` and clears its settings key

The headless Retro-Go harness should schedule two `A` button presses and observe at least two VM resets from a single ROM launch.
