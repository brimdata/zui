import {poolPath} from "src/app/router/utils/paths"
import {ViewHandler} from "src/core/view-handler"
import Tabs from "src/js/state/Tabs"
import {getFormData} from "src/util/get-form-data"

export class NewPoolModalController extends ViewHandler {
  constructor(private close, private state) {
    super()
  }

  async onSubmit(e) {
    try {
      const data = getFormData(e)
      const id = await this.invoke("pools.create", data.name, data)
      this.dispatch(Tabs.activateUrl(poolPath(id)))
      this.toast.success("Pool Created")
      this.close()
    } catch (e) {
      this.state.setError(e)
    }
  }
}
