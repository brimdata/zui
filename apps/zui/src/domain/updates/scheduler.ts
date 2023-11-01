import {UpdateMode} from "./types"

export class Scheduler {
  static interval = 1000 * 60 * 60 * 24 // 1 day

  start(mode: UpdateMode, check: () => any) {
    switch (mode) {
      case "default":
        check()
        this.schedule(check)
        break
      case "startup":
        check()
    }
  }

  private scheduleId: any
  private schedule(check: () => any) {
    this.scheduleId = setTimeout(() => {
      check()
      this.schedule(check)
    }, Scheduler.interval)
  }

  stop() {
    clearTimeout(this.scheduleId)
  }
}
