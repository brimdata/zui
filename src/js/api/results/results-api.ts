import LogDetails from "src/js/state/LogDetails"
import {GetState} from "src/js/state/types"

export class ResultsApi {
  constructor(private getState: GetState) {}

  get selectedValue() {
    return LogDetails.build(this.getState())
  }
}
