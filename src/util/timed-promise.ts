export class TimedPromise {
  private resolve: () => void = () => {}
  private reject: (e: Error) => void = () => {}
  private timeout?: number
  private timeoutId: number | null = null
  private promise: Promise<void>

  constructor(timeout?: number) {
    this.timeout = timeout
    this.promise = new Promise<void>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  complete() {
    clearTimeout(this.timeoutId as number)
    this.resolve()
  }

  expire() {
    clearTimeout(this.timeoutId as number)
    this.reject(new Error(`timeout exceeded ${this.timeout}ms`))
  }

  waitFor() {
    if (this.timeout) {
      this.timeoutId = setTimeout(() => this.expire(), this.timeout)
    }
    return this.promise
  }
}
