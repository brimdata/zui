import Current from "src/js/state/Current"
import LogDetails from "src/js/state/LogDetails"
import {GetState} from "src/js/state/types"

export class CurrentApi {
  constructor(private getState: GetState) {}

  get tabId() {
    return Current.getTabId(this.getState())
  }

  get location() {
    return Current.getLocation(this.getState())
  }

  get poolName() {
    return Current.getQuery(this.getState()).getPoolName()
  }

  get value() {
    return LogDetails.build(this.getState())
  }
}
