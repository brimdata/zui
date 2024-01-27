import {poolPath} from "src/app/router/utils/paths"
import {createHandler} from "src/core/handlers"
import Tabs from "src/js/state/Tabs"
import {getFormData} from "src/util/get-form-data"

const createPool = createHandler(async ({invoke, dispatch, toast}, data) => {
  const id = await invoke("pools.create", data.name, data)
  dispatch(Tabs.activateUrl(poolPath(id)))
  toast.success("Pool Created")
})

export class NewPoolModalController {
  constructor(private props, private state) {}

  async onSubmit(e) {
    try {
      const data = getFormData(e)
      createPool(data)
      this.props.onClose()
    } catch (e) {
      this.state.setError(e)
    }
  }
}
