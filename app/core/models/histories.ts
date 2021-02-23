import {createMemoryHistory} from "history"
import {SerializedHistory} from "src/js/state/TabHistories/types"

export interface HistoryEntry {
  hash: string
  key: string
  pathname: string
  search: string
  state: object | undefined
}

export interface MemoryHistory {
  push: (string) => void
  replace: (string) => void
  goBack: () => void
  goForward: () => void
  entries: HistoryEntry[]
  index: number
  length: number
  location: HistoryEntry
}

export default class Histories {
  histories = new Map<string, MemoryHistory>()

  constructor(data: SerializedHistory[] = []) {
    for (const item of data) {
      this.histories.set(
        item.id,
        createMemoryHistory({
          initialEntries: item.entries,
          initialIndex: item.index
        })
      )
    }
  }

  create(id: string) {
    this.histories.set(id, createMemoryHistory())
    return this.get(id)
  }

  delete(id: string) {
    this.histories.delete(id)
  }

  getOrCreate(id: string) {
    return this.get(id) || this.create(id)
  }

  get(id: string) {
    return this.histories.get(id)
  }

  count() {
    return this.histories.size
  }

  serialize() {
    const array = Array.from(this.histories.entries())
    return array.map(([id, {entries, index}]) => ({
      id,
      entries,
      index
    }))
  }
}
