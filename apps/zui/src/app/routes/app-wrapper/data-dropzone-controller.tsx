import {previewLoadFiles, quickLoadFiles} from "src/domain/loads/handlers"

export class DataDropzoneController {
  constructor(
    private shift: boolean,
    private previewing: boolean,
    private poolId: string
  ) {}

  // prettier-ignore
  get title() {
    if (this.previewing) return (<>Add <em>Files</em></>)
    if (this.shift) return (<>Quick Load <em>Data</em></>)
    return <>Preview & Load <em>Data</em></>
  }

  // prettier-ignore
  get note() {
    if (this.previewing) return null
    if (this.shift) return <>Release <b>{"Shift"}</b> to preview data first.</>
    return <>Hold <b>{"Shift"}</b> to quick load into new pool with defaults.</>
  }

  onDrop(fileObjects: File[]) {
    const files = fileObjects.map((f) => f.path)
    const poolId = this.poolId
    if (this.previewing) {
      previewLoadFiles({files, poolId})
    } else if (this.shift) {
      quickLoadFiles({files})
    } else {
      previewLoadFiles({files, poolId})
    }
  }
}
