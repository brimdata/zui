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
    return QueryInfo.get(this.getState()).poolName
  }

  get value() {
    return LogDetails.build(this.getState())
  }

  get query() {
    return Current.getActiveQuery(this.getState())
  }
}
