import {remote} from "electron"
import path from "path"
import toast from "react-hot-toast"
import {getZealot} from "../flows/getZealot"
import {AppDispatch, State} from "../state/types"
import {
  CommandRegistry,
  ContextMenuRegistry,
  DetailCtxItemBuilder,
  LoaderRegistry,
  SearchCtxItemBuilder
} from "./registries"
import {ConfigsApi, ToolbarApi} from "./ui-apis"
import {StorageApi} from "./storage"
import {Abortables} from "app/core/models/abortables"

export default class BrimApi {
  public abortables = new Abortables()
  public commands = new CommandRegistry()
  public loaders = new LoaderRegistry()
  public contextMenus = {
    search: new ContextMenuRegistry<SearchCtxItemBuilder>(),
    detail: new ContextMenuRegistry<DetailCtxItemBuilder>()
  }
  public toolbar: ToolbarApi
  public configs: ConfigsApi
  public storage: StorageApi

  public toast = toast

  /*
  TODO: store is made public only to make the initial plugin architecture
    migration easier, it will eventually be private
   */
  public dispatch: AppDispatch
  public getState: () => State

  constructor() {}

  public init(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.getState = gs

    this.toolbar = new ToolbarApi(d, gs)
    this.configs = new ConfigsApi(d, gs)
    this.storage = new StorageApi(d, gs)
  }

  public getZealot() {
    return this.dispatch(getZealot())
  }

  public getTempDir() {
    return remote.app.getPath("temp")
  }

  public getAppConfig() {
    return {
      dataRoot: path.join(remote.app.getPath("userData"), "data"),
      zdepsDirectory: path.join(
        remote.app.getAppPath().replace("app.asar", "app.asar.unpacked"),
        "zdeps"
      )
    }
  }
}
