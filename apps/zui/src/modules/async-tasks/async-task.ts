export class AsyncTask {
  private controller = new AbortController()
  constructor(public tags: string[]) {}

  containsAll(targetTags: string[]) {
    return targetTags.every((targetTag) => this.tags.includes(targetTag))
  }

  abort() {
    this.controller.abort()
  }

  get signal() {
    return this.controller.signal
  }
}
