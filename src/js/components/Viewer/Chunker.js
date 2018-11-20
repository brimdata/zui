export default class Chunker {
  constructor({size, height, rowHeight, chunkSize, overScan = 0}) {
    this.size = size
    this.rowHeight = rowHeight
    this.height = height
    this.chunkSize = chunkSize
    this.overScan = overScan
  }

  rows(chunk) {
    const start = chunk * this.chunkSize
    const end = Math.min(this.size - 1, start + this.chunkSize - 1)
    return range(start, end)
  }

  visibleChunks(scrollTop) {
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

const range = (start, end) => {
  const arr = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
}

const down = Math.floor
const max = Math.max
