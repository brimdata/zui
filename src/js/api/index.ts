import {Abortables} from "src/app/core/models/abortables"
import toast from "react-hot-toast"
import {getZealot} from "./core/get-zealot"
import {AppDispatch, State} from "../state/types"
import {QueriesApi} from "./queries/queries-api"
import {PoolsApi} from "./pools/pools-api"
import {getPath, PathName} from "./core/get-path"
import {CommandsApi} from "./commands/cmmands-api"
import {LoadersApi} from "./loaders/loaders-api"
import {Detail, MenusApi, Search} from "./menus/menus-api"
import {ConfigurationsApi} from "./configurations/configurations-api"
import {ToolbarsApi} from "./toolbars/toolbars-api"
import {BrimLake} from "../brim"
import {query, QueryOptions} from "./core/query"
import {CurrentApi} from "./current/current-api"
import {CorrelationsApi} from "./correlations/correlations-api"
import {EditorApi} from "./editor/editor-api"

export default class BrimApi {
  public abortables = new Abortables()
  public commands = new CommandsApi()
  public loaders = new LoadersApi()
  public toolbar: ToolbarsApi
  public configs: ConfigurationsApi
  public queries: QueriesApi
  public pools: PoolsApi
  public current: CurrentApi
  public editor: EditorApi
  public correlations: CorrelationsApi
  public toast = toast
  public contextMenus = {
    search: new MenusApi<Search>(),
    detail: new MenusApi<Detail>(),
  }

  private dispatch: AppDispatch

  init(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.toolbar = new ToolbarsApi(d, gs)
    this.configs = new ConfigurationsApi(d, gs)
    this.queries = new QueriesApi(d, gs)
    this.pools = new PoolsApi(d)
    this.current = new CurrentApi(gs)
    this.correlations = new CorrelationsApi(d)
    this.editor = new EditorApi(d, gs)
  }

  getZealot(lake?: BrimLake, env?: "node" | "web") {
    return this.dispatch(getZealot(lake, env))
  }

  getPath(name: PathName) {
    return getPath(name)
  }

  query(body: string, opts: QueryOptions = {}) {
    return this.dispatch(query(body, opts))
  }
}
