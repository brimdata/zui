import * as zed from "@brimdata/zed-js"
import Current from "src/js/state/Current"
import LogDetails from "src/js/state/LogDetails"
import QueryInfo from "src/js/state/QueryInfo"
import {GetState} from "src/js/state/types"

export class CurrentApi {
  field: zed.Field

  constructor(private getState: GetState) {}

  get lakeId() {
    return Current.getLakeId(this.getState())
  }

  get tabId() {
    return Current.getTabId(this.getState())
  }

  get location() {
    return Current.getLocation(this.getState())
  }

  get poolName() {
    return QueryInfo.getPoolName(this.getState())
  }

  get value() {
    return LogDetails.build(this.getState())
  }
}
