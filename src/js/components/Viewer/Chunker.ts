import { $ReadOnly } from "utility-types";


type Chunk = number[];

export default class Chunker {

  size: number;
  rowHeight: number;
  height: number;
  chunkSize: number;
  overScan: number;

  static isEqual(a: Chunk, b: Chunk) {
    return a[0] === b[0] && a[a.length - 1] === b[b.length - 1];
  }

  constructor(opts: $ReadOnly<Chunker>) {
    this.size = opts.size;
    this.rowHeight = opts.rowHeight;
    this.height = opts.height;
    this.chunkSize = opts.chunkSize;
    this.overScan = opts.overScan;
  }

  isEqual(other: Chunker) {
    return (this.size === other.size && this.rowHeight === other.rowHeight && this.height === other.height && this.chunkSize === other.chunkSize && this.overScan === other.overScan);
  }

  rows(chunk: number) {
    const start = chunk * this.chunkSize;
    const end = min(this.size - 1, start + this.chunkSize - 1);
    const rows = [];
    for (let i = start; i <= end; i++) rows.push(i);
    return rows;
  }

  chunkHeight() {
    return this.rowHeight * this.chunkSize;
  }

  lastChunk() {
    const totalHeight = this.size * this.rowHeight;
    return up(totalHeight / this.chunkHeight()) - 1;
  }

  visibleChunks(scrollTop: number) {
    const numAbove = max(down(scrollTop / this.chunkHeight()), 0);
    const numCanFit = up(this.height / this.chunkHeight());
    const begin = max(numAbove - this.overScan, 0);
    const end = min(numAbove + numCanFit + this.overScan, this.lastChunk() + 1);

    const nums = [];
    for (let i = begin; i < end; ++i) nums.push(i);
    return nums;
  }
}

const up = Math.ceil;
const down = Math.floor;
const max = Math.max;
const min = Math.min;