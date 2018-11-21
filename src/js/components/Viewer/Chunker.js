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

  visibleChunks(scrollTop: number) {
    const chunkHeight = this.rowHeight * this.chunkSize
    const chunksAbove = max(down(scrollTop / chunkHeight), 0)
    const totalHeight = this.size * this.rowHeight
    const viewEnd = this.height + scrollTop + chunkHeight * this.overScan
    const maxChunk = totalHeight / chunkHeight
    const startChunk = max(chunksAbove - this.overScan, 0)
    const chunks = []
    for (
      let chunk = startChunk;
      chunkHeight * chunk < viewEnd + 1 && chunk < maxChunk;
      chunk++
    ) {
      chunks.push(chunk)
    }
    return chunks
  }
}

const down = Math.floor
const max = Math.max
const min = Math.min
