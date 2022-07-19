import {Abortables} from "src/app/core/models/abortables"
import toast from "react-hot-toast"
import {getZealot} from "../flows/getZealot"
import {AppDispatch, State} from "../state/types"
import {StorageApi} from "./storage"
import {ConfigsApi, ToolbarApi} from "./ui-apis"
import {QueriesApi} from "./queries/queries-api"
import {PoolsApi} from "./pools/pools-api"
import {getPath, PathName} from "./paths/get-path"
import {CommandsApi} from "./commands/cmmands-api"
import {LoadersApi} from "./loaders/loaders-api"
import {Detail, MenusApi, Search} from "./menus/menus-api"

export default class BrimApi {
  public abortables = new Abortables()
  public commands = new CommandsApi()
  public loaders = new LoadersApi()
  public toolbar: ToolbarApi
  public configs: ConfigsApi
  public storage: StorageApi
  public queries: QueriesApi
  public pools: PoolsApi
  public toast = toast
  public contextMenus = {
    search: new MenusApi<Search>(),
    detail: new MenusApi<Detail>(),
  }

  private dispatch: AppDispatch
  private getState: () => State

  init(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.getState = gs
    this.toolbar = new ToolbarApi(d, gs)
    this.configs = new ConfigsApi(d, gs)
    this.storage = new StorageApi(d, gs)
    this.queries = new QueriesApi(d)
    this.pools = new PoolsApi(d)
  }

  getZealot() {
    return this.dispatch(getZealot())
  }

  getPath(name: PathName) {
    return getPath(name)
  }
}
