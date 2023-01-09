import {Abortables} from "src/app/core/models/abortables"
import toast from "react-hot-toast"
import {getZealot} from "./core/get-zealot"
import {AppDispatch, GetState} from "../state/types"
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
import {NoticeApi} from "./notice/notice-api"
import {UrlApi} from "./url/url-api"
import {LayoutApi} from "./layout-api"

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
  public url: UrlApi
  public toast = toast
  public contextMenus = {
    search: new MenusApi<Search>(),
    detail: new MenusApi<Detail>(),
  }
  public dispatch: AppDispatch
  public getState: GetState
  public notice: NoticeApi
  public layout: LayoutApi

  init(d: AppDispatch, gs: GetState) {
    this.dispatch = d
    this.getState = gs
    this.toolbar = new ToolbarsApi(d, gs)
    this.configs = new ConfigurationsApi(d, gs)
    this.queries = new QueriesApi(d, gs)
    this.pools = new PoolsApi(this)
    this.current = new CurrentApi(gs)
    this.correlations = new CorrelationsApi(d)
    this.editor = new EditorApi(d, gs)
    this.notice = new NoticeApi(this)
    this.url = new UrlApi(this)
    this.layout = new LayoutApi(this)
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
