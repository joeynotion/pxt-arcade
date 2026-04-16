# Retro-Go Panic Smoke

This fixture intentionally triggers `control.panic(321)` after a short delay.

The Retro-Go SDL harness should observe a valid package that reaches the VM,
then transitions into a non-zero VM panic state without crashing the host.
