import {DefaultLoader} from "./default-loader"
import {LoadContext} from "./load-context"
import {Loader} from "src/core/loader/types"
import Loads from "src/js/state/Loads"
import {select} from "src/core/main/select"
import {TypedEmitter} from "src/util/typed-emitter"
import {LoadReference} from "src/js/state/Loads/types"

type Events = {
  success: (load: LoadReference) => void
  abort: (load: LoadReference) => void
  error: (load: LoadReference) => void
}

type LoaderRef = {name: string; initialize: (ctx: LoadContext) => Loader}

export class LoadsApi extends TypedEmitter<Events> {
  private list: LoaderRef[] = []

  addLoader(name: string, initialize: (ctx: LoadContext) => Loader) {
    this.list.push({name, initialize})
  }

  async initialize(context: LoadContext) {
    for (const ref of this.list) {
      const customLoader = ref.initialize(context)
      if (await customLoader.when()) return customLoader
    }
    return new DefaultLoader(context)
  }

  get all() {
    return select(Loads.all)
  }
}
