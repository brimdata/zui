export default class ConnDuration {
  constructor({ts, duration}) {
    this.ts = ts.clone()
    this.duration = duration
  }

  startMoment() {
    return this.ts
  }

  endMoment() {
    return this.ts.clone().add(this.duration, "seconds")
  }
}
