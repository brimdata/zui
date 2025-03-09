import {isAbortError} from "src/util/is-abort-error"

export class AsyncTask {
  private controller = new AbortController()

  constructor(public tags: string[], private destroy: () => void) {}

  containsAll(targetTags: string[]) {
    return targetTags.every((targetTag) => this.tags.includes(targetTag))
  }

  abort() {
    this.controller.abort("Aborting task")
  }

  get signal() {
    return this.controller.signal
  }

  async run<T>(taskBody: (signal: AbortSignal) => T) {
    try {
      return await taskBody(this.signal)
    } catch (error) {
      if (isAbortError(error)) return
      throw error
    } finally {
      this.destroy()
    }
  }
}
