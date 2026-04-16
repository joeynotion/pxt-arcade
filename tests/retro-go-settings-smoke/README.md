# Retro-Go Settings Smoke

This fixture verifies settings persistence across a VM reset.

Behavior:

- boot 1 reads and increments a settings counter, then resets
- boot 2 reads the persisted counter again and stops resetting

The headless Retro-Go harness should observe at least one VM reset and a stable booted state afterward.
