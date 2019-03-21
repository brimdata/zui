/* @flow */

import type {BoomSearchStats} from "../types"
import {bytes, withCommas} from "../lib/fmt"

export default class Stats {
  updateTime: number
  startTime: number
  bytesMatched: number
  bytesRead: number
  tuplesMatched: number
  tuplesRead: number

  constructor(stats: BoomSearchStats) {
    Object.assign(this, stats)
  }

  getElapsed() {
    const result = (
      parseFloat(this.updateTime) - parseFloat(this.startTime)
    ).toFixed(2)
    return isNaN(result) ? "0.00" : result
  }

  getBytesMatched() {
    return bytes(this.bytesMatched)
  }

  getBytesRead() {
    return bytes(this.bytesRead)
  }

  getTuplesMatched() {
    return withCommas(this.tuplesMatched)
  }

  getTuplesRead() {
    return withCommas(this.tuplesRead)
  }
}
