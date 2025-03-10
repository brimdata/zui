import {
  exportToClipboard,
  exportToFile,
  exportToPool,
} from "src/domain/results/handlers"
import {getFormData} from "src/util/get-form-data"
import {useExportModalState} from "./state"
import {pluralize} from "src/util/pluralize"
import {invoke} from "src/core/invoke"
import {isAbortError} from "src/util/is-abort-error"

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
        this.state.setIsCopying(true)
        try {
          await exportToClipboard(data.format)
        } catch (e) {
          if (isAbortError(e)) return
        } finally {
          this.state.setIsCopying(false)
        }
        return
    }
  }

  close() {
    this.onClose()
  }

  cancelCopyToClipboard() {
    invoke("results.cancelCopyToClipboard")
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
