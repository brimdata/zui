import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import popupPosition from "../../popup-position"

export const showMenu = (anchor: HTMLElement) => (dispatch, getState) => {
  const s = getState()
  const lakeId = Current.getLakeId(s)
  const pools = Pools.getPools(lakeId)(s)

  let selected = null
  const template = pools
    ? pools
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((p) => ({
          label: p.name,
          click: () => {
            selected = p.name
          },
        }))
    : [
        {
          label: "No pools in lake",
          enabled: false,
        },
      ]

  return new Promise((resolve) => {
    showContextMenu(template, {
      callback: () => resolve(selected),
      ...popupPosition(anchor),
    })
  })
}
