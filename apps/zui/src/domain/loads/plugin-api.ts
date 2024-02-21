import {LoadContext} from "./load-context"
import Loads from "src/js/state/Loads"
import {select} from "src/core/main/select"
import {TypedEmitter} from "src/util/typed-emitter"
import {DEFAULT_LOADERS} from "./default-loaders"
import {LoadEvents, Loader, LoaderRef} from "./types"

export class LoadsApi extends TypedEmitter<LoadEvents> {
  private list: LoaderRef[] = []

  addLoader(name: string, initialize: (ctx: LoadContext) => Loader) {
    this.list.push({name, initialize})
  }

  async initialize(context: LoadContext) {
    for (const {initialize} of this.loaders) {
      const loader = initialize(context)
      if (await loader.when()) return loader
    }
    throw new Error("Loader not found")
  }

  private get loaders() {
    return [...this.list, ...DEFAULT_LOADERS]
  }

  get all() {
    return select(Loads.all)
  }
}
