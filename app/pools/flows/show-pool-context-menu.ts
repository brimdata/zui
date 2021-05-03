import {MenuItemConstructorOptions} from "electron/main"
import {BrimPool} from "src/js/brim"
import {popNotice} from "src/js/components/PopNotice"
import deletePool from "src/js/flows/deletePool"
import deletePools from "src/js/flows/deletePools"
import {showContextMenu, showMessageBox} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Modal from "src/js/state/Modal"
import Pools from "src/js/state/Pools"

const showPoolContextMenu = (pool: BrimPool) => (dispatch, getState) => {
  const workspaceId = Current.getWorkspaceId(getState())
  const poolIds = Pools.ids(workspaceId)(getState())
  const template = [
    {
      label: "Rename",
      click: () => {
        dispatch(Modal.show("pool", {workspaceId, poolId: pool.id}))
      }
    },
    {
      label: "Delete",
      click: () => {
        showMessageBox({
          type: "warning",
          title: "Delete Pool",
          message: `Are you sure you want to delete ${pool.name}?`,
          buttons: ["OK", "Cancel"]
        }).then(({response}) => {
          if (response === 0)
            dispatch(deletePool(pool.id)).then(() => {
              popNotice(`Deleted pool "${pool.name}"`)
            })
        })
      }
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () => {
        showMessageBox({
          type: "warning",
          title: "Delete All Pools",
          message: `Are you sure you want to delete all pools for this workspace?`,
          buttons: ["OK", "Cancel"]
        }).then(({response}) => {
          if (response === 0)
            dispatch(deletePools(poolIds)).then(() => {
              popNotice("Deleted all pools")
            })
        })
      }
    }
  ] as MenuItemConstructorOptions[]

  showContextMenu(template)
}

export default showPoolContextMenu
