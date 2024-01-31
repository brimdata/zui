import {
  exportToClipboard,
  exportToFile,
  exportToPool,
} from "src/domain/results/handlers"
import {getFormData} from "src/util/get-form-data"
import {ExportModalProps, ExportModalState} from "."

export class ExportModalController {
  // add default for zng or the last most recent format
  constructor(
    private props: ExportModalProps,
    private state: ExportModalState
  ) {}

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
    this.props.onClose()
  }
}
