import {createHandler} from "src/core/handlers"
import Modal from "src/js/state/Modal"

export const newPool = createHandler("pools.new", ({dispatch}) => {
  dispatch(Modal.show("new-pool"))
})

type PoolFormData = {
  poolId: string
  name?: string
  key?: string
  order?: string
}
export const getOrCreatePool = createHandler(
  async ({invoke}, data: PoolFormData) => {
    if (data.poolId === "new") {
      return await invoke("pools.create", data.name, {
        key: data.key,
        order: data.order as "desc" | "asc",
      })
    } else {
      return data.poolId
    }
  }
)
