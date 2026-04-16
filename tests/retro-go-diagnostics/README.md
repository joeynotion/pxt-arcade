# Retro-Go Diagnostics

`RGD-0.1` is the first MakeCode Arcade bridge diagnostic program.

Expected behavior:

- Heartbeat flashes in the top-right corner.
- Color bars cover palette entries 1 through 15 near the bottom.
- D-pad changes the highlighted U/D/L/R boxes and moves the small square.
- A and B increment their counters, flash the square, update `last`, and play distinct tones.
- Menu increments the M counter and updates `last MENU`.
- The footer reads `status OK`.

This package is a test fixture only; bridge runtime code must not depend on it.
