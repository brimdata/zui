import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {setFromPin} from "../handlers"
import {createMenu} from "src/core/menu"

export const choosePoolMenu = createMenu(({select}) => {
  const lakeId = select(Current.getLakeId)
  const pools = select(Pools.getPools(lakeId)).sort()
  if (!pools.length) {
    return [{label: "No Pools", enabled: false}]
  } else {
    return pools.map((pool) => ({
      label: pool.name,
      click: () => setFromPin(pool.name),
    }))
  }
})
