import {ViewHandler} from "src/core/view-handler"
import {getQueryUrlParams} from "src/js/state/Current/selectors"
import {NamedQuery} from "src/models/named-query"

export class SessionPageHandler extends ViewHandler {
  async readQuery() {
    return await NamedQuery.read(this.queryFilePath)
  }

  get queryFilePath() {
    return decodeURIComponent(this.select(getQueryUrlParams).queryId)
  }
}
