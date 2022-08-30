import EventEmitter from "events"
import {DefaultContext, zed, zjson} from ".."
import {Collector, TypeDefs} from "../types"
import {DecodeStream} from "../zed/decode-stream"

export class Channel extends EventEmitter {
  rows: zed.Value[] = []
  shapesMap: TypeDefs = {}
  stream = new DecodeStream(DefaultContext)

  get shapes() {
    return Object.values(this.shapesMap)
  }

  addRow(row: zed.Value) {
    this.rows.push(row)
    this.emit("row", row)
  }

  addShape(id: number, type: zed.Type) {
    this.shapesMap[id] = type
    this.emit("shape", type)
  }

  hasShape(id: number) {
    return id in this.shapesMap
  }

  done() {
    this.emit("end")
  }

  consume(json: zjson.Object) {
    const value = this.stream.decode(json)
    if ("id" in json.type && !this.hasShape(json.type.id)) {
      this.addShape(json.type.id, value.type)
    }
    this.addRow(value)
  }

  collect(collector: Collector) {
    /**
     * The goal here is to get the first batch of results out
     * to the collector as soon as possible. Then, only give
     * updates every timeThres. This allows the UI to avoid
     * frequent, expensive updates.
     */
    let first = true
    let count = 0
    let countThresh = 2000
    let timeThresh = 2000
    let timeId = 0

    const flush = () => {
      collector({rows: this.rows, shapesMap: this.shapesMap})
      first = false
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
      if (first && count >= countThresh) flush()
    })

    this.on("end", () => flush())

    startTimer()
  }
}
