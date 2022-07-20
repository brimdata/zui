import Current from "src/js/state/Current"
import {GetState} from "src/js/state/types"

export class CurrentApi {
  constructor(private getState: GetState) {}

  get tabId() {
    return Current.getTabId(this.getState())
  }
}
