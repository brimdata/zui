import menu from "./"

export default function spaceContextMenu(clusterId: string) {
  return function(spaceId: string, spaceName?: string) {
    const spaceMenuActions = menu.actions.space

    return [
      spaceMenuActions.rename.menuItem([clusterId, spaceId], {
        enabled: true,
        visible: true
      }),
      spaceMenuActions.delete.menuItem([spaceId, spaceName], {
        enabled: true,
        visible: true
      })
    ]
  }
}
