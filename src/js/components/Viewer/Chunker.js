/* @flow */
type Chunk = number[]

export default class Chunker {
  size: number
  rowHeight: number
  height: number
  chunkSize: number

  static isEqual(a: Chunk, b: Chunk) {
    return a[0] === b[0] && a[a.length - 1] === b[b.length - 1]
  }

  constructor(opts: $ReadOnly<Chunker>) {
    this.size = opts.size
    this.rowHeight = opts.rowHeight
    this.height = opts.height
    this.chunkSize = opts.chunkSize
  }

  rows(chunk: number) {
    const start = chunk * this.chunkSize
    const end = min(this.size - 1, start + this.chunkSize - 1)
    const rows = []
    for (let i = start; i <= end; i++) rows.push(i)
    return rows
  }

  chunkHeight() {
    return this.rowHeight * this.chunkSize
  }

  lastChunk() {
    const totalHeight = this.size * this.rowHeight
    return up(totalHeight / this.chunkHeight()) - 1
  }

  visibleChunks(scrollTop: number) {
    const chunkHeight = this.chunkHeight()
    const chunksAbove = max(down(scrollTop / chunkHeight), 0)

    const lastChunk = this.lastChunk()
    const startChunk = max(chunksAbove, 0)
    const chunks = []

    const length = up(this.height / chunkHeight) + 1

    let chunk = startChunk
    for (let i = 0; i < length && chunk <= lastChunk; ++i) {
      chunks.push(chunk++)
    }
    return chunks
  }
}

const up = Math.ceil
const down = Math.floor
const max = Math.max
const min = Math.min
