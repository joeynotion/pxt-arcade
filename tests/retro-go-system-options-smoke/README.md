This smoke fixture verifies that the MakeCode `menu` button opens the same built-in Arcade system options menu as a direct `scene.systemMenu.showSystemMenu()` call.

Expected flow:
- the SDL harness opens the menu once using `A` as a direct reference path
- the SDL harness opens the menu once using the MakeCode `menu` button path
- both resulting snapshots should match
