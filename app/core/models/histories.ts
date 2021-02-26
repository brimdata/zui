import {
  createMemoryHistory,
  LocationListener,
  MemoryHistory,
  UnregisterCallback
} from "history"
import {SerializedHistory} from "src/js/state/TabHistories/types"

export default class Histories {
  histories = new Map<string, MemoryHistory>()
  unlistens = new Map<string, UnregisterCallback>()
  listener: LocationListener = () => {}

  constructor(data: SerializedHistory[] = []) {
    for (const {id, entries, index} of data) this.create(id, entries, index)
  }

  listen(listener: LocationListener) {
    this.listener = listener
    this.histories.forEach((h, id) => this.listenTo(id, h))
    return () => this.unlistens.forEach((fn) => fn())
  }

  create(id: string, initialEntries?, initialIndex?) {
    const history = createMemoryHistory({initialEntries, initialIndex})
    this.histories.set(id, history)
    this.listenTo(id, history)
    return history
  }

  delete(id: string) {
    this.unListenTo(id)
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

  private listenTo(id, history) {
    this.unListenTo(id)
    const listener: LocationListener = (...a) => this.listener(...a)
    this.unlistens.set(id, history.listen(listener))
  }

  private unListenTo(id) {
    const unlisten = this.unlistens.get(id)
    if (unlisten) unlisten()
    this.unlistens.delete(id)
  }
}
