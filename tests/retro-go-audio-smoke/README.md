# Retro-Go Audio Smoke

This fixture exercises the mixer path and resets once after a short tone sequence.

Behavior:

- boot 1 queues three tones, then resets
- boot 2 queues the same tones and stays running

The headless Retro-Go harness should observe at least one VM reset and no panic.
