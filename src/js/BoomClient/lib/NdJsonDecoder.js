/* @flow */

const NEW_LINE = "\n\n\n"

export default class NdJsonDecoder {
  leftover: string
  callback: (Object) => *

  constructor(callback: (Object) => *) {
    this.leftover = ""
    this.callback = callback
  }

  decode(value: string) {
    let start = 0
    let end = 0
    let chunk = (this.leftover += value)

    while ((end = chunk.indexOf(NEW_LINE, start)) !== -1) {
      const line = chunk.substring(start, end)
      const json = JSON.parse(line)
      this.callback(json)
      start = end + NEW_LINE.length
    }
    this.leftover = chunk.substring(start)
  }

  flush() {
    if (this.leftover.length > 0) {
      this.callback(JSON.parse(this.leftover))
    }
  }
}
