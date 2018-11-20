export default class Chunker {
  constructor({size, height, rowHeight, chunkSize}) {
    this.size = size
    this.rowHeight = rowHeight
    this.height = height
    this.chunkSize = chunkSize
  }

  rows(chunk) {
    const start = chunk * this.chunkSize
    const end = Math.min(this.size - 1, start + this.chunkSize - 1)
    return range(start, end)
  }

  visibleChunks(scrollTop) {
    const above = Math.floor(scrollTop / this.rowHeight)
    const willFit = Math.ceil(this.height / this.rowHeight)
    const start = Math.max(0, above)
    const end = Math.min(this.size - 1, above + willFit)
    const chunkStart = Math.floor(start / this.chunkSize)
    const chunkEnd = Math.ceil(end / this.chunkSize)
    const totalChunks = Math.floor((this.size - 1) / this.chunkSize)
    return range(
      Math.max(0, chunkStart - 2),
      Math.min(totalChunks, chunkEnd + 2)
    )
  }
}

const range = (start, end) => {
  const arr = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
}
