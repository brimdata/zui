/* @flow */
import menu from "./"

export default function spaceContextMenu(clusterId: string) {
  return function(spaceId: string) {
    const spaceMenuActions = menu.actions.space

    return [
      spaceMenuActions.rename.menuItem([clusterId, spaceId], {
        enabled: true,
        visible: true
      })
    ]
  }
}
