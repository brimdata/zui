import {defaultLoader} from "src/core/loader/default-loader"
import {LoadContext} from "src/core/loader/load-context"
import {Loader} from "src/core/loader/types"

export class LoadersApi {
  private list: LoaderApi[] = []

  create(name: string, impl: Loader) {
    this.list.push(new LoaderApi(name, impl))
  }

  async getMatch(context: LoadContext) {
    let loader = defaultLoader
    for (const pluginLoader of this.list) {
      if (await pluginLoader.when(context)) {
        loader = pluginLoader
        break
      }
    }
    return loader
  }
}

class LoaderApi {
  when: Loader["when"]
  run: Loader["run"]
  rollback: Loader["rollback"]

  constructor(public name: string, impl: Loader) {
    this.when = impl.when
    this.run = impl.run
    this.rollback = impl.rollback
  }
}
