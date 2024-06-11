import {sortedIndex} from "lodash"

export type Position = {
  column: number
  lineNumber: number
}

export class Source {
  start: number
  length: number
  lines: number[]

  constructor(start: number, text: string) {
    this.start = start
    this.length = text.length
    this.lines = [0]

    for (let k = 0; k < text.length; k++) {
      if (text[k] === "\n") {
        this.lines.push(k + 1)
      }
    }
  }

  position(pos: number): Position {
    let offset = pos - this.start
    let i = sortedIndex(this.lines, offset) - 1
    return {
      column: offset - this.lines[i] + 1,
      lineNumber: i + 1,
    }
  }
}
