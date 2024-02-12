import {
  exportToClipboard,
  exportToFile,
  exportToPool,
} from "src/domain/results/handlers"
import {getFormData} from "src/util/get-form-data"
import {useExportModalState} from "./state"
import {pluralize} from "src/util/pluralize"

type ExportModalState = ReturnType<typeof useExportModalState>

export class ExportModalController {
  constructor(private onClose: () => void, private state: ExportModalState) {}

  async submit(e) {
    e.preventDefault()
    const data = getFormData(e)
    switch (data.submit) {
      case "toPool":
        exportToPool(data)
        this.close()
        return
      case "toFile":
        if (await exportToFile(data.format)) this.close()
        return
      case "toClipboard":
        exportToClipboard(data.format)
        return
    }
  }

  close() {
    this.onClose()
  }

  get summary() {
    const {count, countStatus} = this.state
    if (countStatus === "FETCHING") {
      return "Calculating number of rows..."
    } else {
      return `This export will include ${count?.toLocaleString()} ${pluralize(
        "row",
        count
      )}.`
    }
  }
}
