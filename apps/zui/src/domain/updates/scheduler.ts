import {UpdateMode} from "./types"

export class Scheduler {
  static interval = 1000 * 60 * 60 * 24 // 1 day

  start(mode: UpdateMode, check: () => any, args: {delay?: number} = {}) {
    switch (mode) {
      case "default":
        this.delay(check, args.delay)
        this.schedule(check)
        break
      case "startup":
        this.delay(check, args.delay)
    }
  }

  private delayedId: any
  private delay(check, ms = 0) {
    this.delayedId = setTimeout(check, ms)
  }

  private scheduleId: any
  private schedule(check: () => any) {
    this.scheduleId = setTimeout(() => {
      check()
      this.schedule(check)
    }, Scheduler.interval)
  }

  stop() {
    clearTimeout(this.delayedId)
    clearTimeout(this.scheduleId)
  }
}
