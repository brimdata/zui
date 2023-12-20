import {LoadReference} from "src/js/state/Loads/types"
import {basename} from "src/util/basename"

export class LoadModel {
  constructor(private ref: LoadReference) {}

  get id() {
    return this.ref.id
  }

  get humanizeFiles() {
    return this.ref.files.map(basename).join(", ")
  }

  get status() {
    if (this.abortedAt) return "aborted"
    if (this.finishedAt) {
      if (this.errors.length) return "error"
      else return "success"
    }
    return "loading"
  }

  get startedAt() {
    return new Date(this.ref.startedAt)
  }

  get finishedAt() {
    if (this.ref.finishedAt) return new Date(this.ref.finishedAt)
    return null
  }

  get abortedAt() {
    if (this.ref.abortedAt) return new Date(this.ref.abortedAt)
    return null
  }

  get errors() {
    return this.ref.errors
  }

  get progress() {
    return this.ref.progress
  }
}
