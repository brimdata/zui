import {LoadReference} from "src/js/state/Loads/types"
import * as fmt from "date-fns"

export class LoadModel {
  constructor(private ref: LoadReference) {}

  get id() {
    return this.ref.id
  }

  get humanizeFiles() {
    // basename
    return this.ref.files.join(", ")
  }

  get status() {
    if (this.abortedAt) return "aborted"
    if (this.finishedAt) {
      if (this.errors.length) return "error"
      else return "success"
    }
    return "loading"
  }

  get statusMessage() {
    switch (this.status) {
      case "aborted":
        return `Aborted ${fmt.formatDistanceToNow(this.abortedAt)} ago`
      case "loading":
        return `Started ${fmt.formatDistanceToNow(this.startedAt)} ago`
      case "error":
        return `Finished in ${fmt.formatDistanceStrict(
          this.startedAt,
          this.finishedAt
        )} with ${this.errors.length} errors.`
      case "success":
        return `Finished ${fmt.formatDistanceToNow(
          this.finishedAt
        )} ago in ${fmt.formatDistanceStrict(
          this.startedAt,
          this.finishedAt
        )} with no errors. `
    }
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
