import moment from "moment"

export default class Timer {
  constructor(name) {
    this.name = name
    this.startTime = null
    this.endTime = null
  }

  start() {
    this.startTime = new Date()
  }

  stop() {
    this.endTime = new Date()
  }

  elapsed(unit) {
    return moment(this.endTime).diff(moment(this.startTime), unit)
  }
}
