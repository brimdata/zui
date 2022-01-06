import EventEmitter from "events"
import {SearchResult} from "../flows/search/mod"

type CB<T> = (data: T) => void

export class SearchesApi {
  private emitter = new EventEmitter()

  onDidFinish(cb: CB<SearchResult>) {
    return this.listenTo("did-finish", cb)
  }

  // Should only be called in brim code, not plugin code
  emit(name: "did-finish", ...args: [SearchResult]): void
  emit(name: never, ...args: never[]) {
    this.emitter.emit(name, ...args)
  }

  private listenTo(name: string, cb: any) {
    this.emitter.addListener(name, cb)
    return () => this.emitter.removeListener(name, cb)
  }
}
