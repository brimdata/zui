import {MenuItemConstructorOptions} from "electron/main"
import toast from "react-hot-toast"
import {BrimPool} from "src/js/brim"
import deletePool from "src/js/flows/deletePool"
import deletePools from "src/js/flows/deletePools"
import {showMessageBox} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"

const getPoolContextMenu = (pool: BrimPool) => (dispatch, getState) => {
  const workspaceId = Current.getWorkspaceId(getState())
  const poolIds = Pools.ids(workspaceId)(getState())
  return [
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
            toast.promise(
              dispatch(deletePool(pool.id)),
              {
                loading: `Deleting pool "${pool.name}"`,
                success: `Deleted pool "${pool.name}"`,
                error: (err) => {
                  console.error(err)
                  return "Error deleting pool: " + err.message
                }
              },
              {
                loading: {
                  // setTimeout's maximum value is a 32-bit int, so we explicitly specify here
                  // also, once https://github.com/timolins/react-hot-toast/pull/37 merges, we can set this to -1
                  duration: 2 ** 31 - 1
                },
                success: {
                  duration: 3000
                },
                error: {
                  duration: 5000
                }
              }
            )
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
          message: `Are you sure you want to delete all pools in this lake?`,
          buttons: ["OK", "Cancel"]
        }).then(({response}) => {
          if (response === 0)
            dispatch(deletePools(poolIds)).then(() => {
              toast("Deleted all pools")
            })
        })
      }
    }
  ] as MenuItemConstructorOptions[]
}

export default getPoolContextMenu
