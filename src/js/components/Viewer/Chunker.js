/* @flow */
type Chunk = number[]

export default class Chunker {
  size: number
  rowHeight: number
  height: number
  chunkSize: number
  overScan: number

  static isEqual(a: Chunk, b: Chunk) {
    return a[0] === b[0] && a[a.length - 1] === b[b.length - 1]
  }

  constructor(opts: $ReadOnly<Chunker>) {
    this.size = opts.size
    this.rowHeight = opts.rowHeight
    this.height = opts.height
    this.chunkSize = opts.chunkSize
    this.overScan = opts.overScan
  }

  rows(chunk: number) {
    const start = chunk * this.chunkSize
    const end = min(this.size - 1, start + this.chunkSize - 1)
    const rows = []
    for (let i = start; i <= end; i++) rows.push(i)
    return rows
  }

  lastChunk() {
    const totalHeight = this.size * this.rowHeight
    const chunkHeight = this.rowHeight * this.chunkSize
    return up(totalHeight / chunkHeight) - 1
  }

  visibleChunks(scrollTop: number) {
    const chunkHeight = this.rowHeight * this.chunkSize
    const chunksAbove = max(down(scrollTop / chunkHeight), 0)
    const viewEnd = this.height + scrollTop + chunkHeight * this.overScan

    const lastChunk = this.lastChunk()
    const startChunk = max(chunksAbove - this.overScan, 0)
    const chunks = []
    for (
      let chunk = startChunk;
      chunkHeight * chunk < viewEnd + 1 && chunk <= lastChunk;
      chunk++
    ) {
      chunks.push(chunk)
    }
    return chunks
  }
}

const up = Math.ceil
const down = Math.floor
const max = Math.max
const min = Math.min
