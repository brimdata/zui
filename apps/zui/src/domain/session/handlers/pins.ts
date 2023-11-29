import {MenuItemConstructorOptions} from "electron"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Pools from "src/js/state/Pools"
import {submitSearch} from "./submit-search"

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
        submitSearch()
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
        submitSearch()
      },
    },
    {
      label: "Disable Others",
      enabled: pins.some((p) => !p.disabled),
      click: () => {
        dispatch(Editor.disableOtherPins(index))
        submitSearch()
      },
    },
    {type: "separator"},
    {
      label: "Enable",
      enabled: !!pin.disabled,
      click: () => {
        dispatch(Editor.enablePin(index))
        submitSearch()
      },
    },
    {
      label: "Enable Others",
      enabled: pins.some((p) => p.disabled),
      click: () => {
        dispatch(Editor.enableOtherPins(index))
        submitSearch()
      },
    },
    {type: "separator"},
    {
      label: "Delete",
      click: () => {
        dispatch(Editor.deletePin(index))
        submitSearch()
      },
    },
    {
      label: "Delete to the Right",
      click: () => {
        dispatch(Editor.deletePinsToTheRight(index))
        submitSearch()
      },
    },
    {
      label: "Delete All",
      click: () => {
        dispatch(Editor.deleteAllPins())
        submitSearch()
      },
    },
  ] as MenuItemConstructorOptions[]
})
