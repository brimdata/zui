import {MenuItemConstructorOptions} from "electron"
import submitSearch from "src/app/query-home/flows/submit-search"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Pools from "src/js/state/Pools"

export const choosePoolMenu = createHandler(({select, dispatch}) => {
  const lakeId = select(Current.getLakeId)
  const pools = select(Pools.getPools(lakeId)).sort()
  if (!pools.length) {
    return [{label: "No Pools", enabled: false}]
  } else {
    return pools.map((pool) => ({
      label: pool.name,
      click: () => {
        dispatch(Editor.setFrom(pool.name))
        dispatch(submitSearch())
      },
    }))
  }
})

export const pinMenu = createHandler(({select, dispatch}, index) => {
  const pins = select(Editor.getPins)
  const pin = pins[index]
  return [
    {
      label: "Disable",
      enabled: !pin.disabled,
      click: () => {
        dispatch(Editor.disablePin(index))
        dispatch(submitSearch())
      },
    },
    {
      label: "Disable Others",
      enabled: pins.some((p) => !p.disabled),
      click: () => {
        dispatch(Editor.disableOtherPins(index))
        dispatch(submitSearch())
      },
    },
    {type: "separator"},
    {
      label: "Enable",
      enabled: !!pin.disabled,
      click: () => {
        dispatch(Editor.enablePin(index))
        dispatch(submitSearch())
      },
    },
    {
      label: "Enable Others",
      enabled: pins.some((p) => p.disabled),
      click: () => {
        dispatch(Editor.enableOtherPins(index))
        dispatch(submitSearch())
      },
    },
    {type: "separator"},
    {
      label: "Delete",
      click: () => {
        dispatch(Editor.deletePin(index))
        dispatch(submitSearch())
      },
    },
    {
      label: "Delete to the Right",
      click: () => {
        dispatch(Editor.deletePinsToTheRight(index))
        dispatch(submitSearch())
      },
    },
    {
      label: "Delete All",
      click: () => {
        dispatch(Editor.deleteAllPins())
        dispatch(submitSearch())
      },
    },
  ] as MenuItemConstructorOptions[]
})
