import EventEmitter from "events"
import {zed} from ".."
import {Record} from "../zed"
import {Type} from "../zed/types/types"

export type TypeDefs = {[name: string]: Type}
export type Collector = (vals: {rows: zed.Value[]; shapesMap: TypeDefs}) => void

export class Channel extends EventEmitter {
  rows: Record[] = []
  typesMap: TypeDefs = {}
  shapesMap: TypeDefs = {}

  get shapes() {
    return Object.values(this.shapesMap)
  }

  addRow(row: zed.Record) {
    this.rows.push(row)
    this.emit("row", row)
  }

  addShape(name: string) {
    const shape = this.typesMap[name]
    this.shapesMap[name] = shape
    this.emit("shape", shape)
  }

  hasShape(name: string) {
    return name in this.shapesMap
  }

  done() {
    this.emit("end")
  }

  collect(collector: Collector) {
    let count = 0
    let countThresh = 10
    let timeThresh = 500
    let timeId = 0

    const flush = () => {
      collector({rows: this.rows, shapesMap: this.shapesMap})
      count = 0
      clearTimeout(timeId)
    }

    const startTimer = () => {
      timeId = setTimeout(() => {
        if (count > 0) flush()
        startTimer()
      }, timeThresh)
    }

    this.on("row", () => {
      count += 1
      if (count >= countThresh) flush()
    })

    this.on("end", () => flush())

    startTimer()
  }
}
