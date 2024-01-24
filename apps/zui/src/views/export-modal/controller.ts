import {exportToPool} from "src/domain/results/handlers"
import {getFormData} from "src/util/get-form-data"

export class ExportModalController {
  // add default for zng or the last most recent format
  constructor(public close: any) {}

  submit(e) {
    e.preventDefault()
    const data = getFormData(e)
    console.log(data)
    if (data.dest === "Pool") {
      exportToPool(data)
      this.close()
    } else if (data.dest === "File") {
      console.log("TODO exportToFile")
    }
  }
}
