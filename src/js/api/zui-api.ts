import {Abortables} from "src/app/core/models/abortables"
import toast from "react-hot-toast"
import {getZealot} from "./core/get-zealot"
import {AppDispatch, GetState, State} from "../state/types"
import {QueriesApi} from "./queries/queries-api"
import {PoolsApi} from "./pools/pools-api"
import {CommandsApi} from "./commands/cmmands-api"
import {Detail, MenusApi, Search} from "./menus/menus-api"
import {ConfigurationsApi} from "./configurations/configurations-api"
import {ToolbarsApi} from "./toolbars/toolbars-api"
import {CurrentApi} from "./current/current-api"
import {EditorApi} from "./editor/editor-api"
import {NoticeApi} from "./notice/notice-api"
import {UrlApi} from "./url/url-api"
import {LayoutApi} from "./layout-api"
import {TableViewApi} from "src/zui-kit"
import {LakeModel} from "../models/lake"

// This should start to be deprecated maybe...
export default class ZuiApi {
  table: TableViewApi | null = null
  public abortables = new Abortables()
  public commands = new CommandsApi()
  public toolbar: ToolbarsApi
  public configs: ConfigurationsApi
  public queries: QueriesApi
  public pools: PoolsApi
  public current: CurrentApi
  public editor: EditorApi
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
    this.editor = new EditorApi(d, gs)
    this.notice = new NoticeApi(this)
    this.url = new UrlApi(this)
    this.layout = new LayoutApi(this)
  }

  getZealot(lake?: LakeModel) {
    return this.dispatch(getZealot(lake))
  }

  createAbortable(tab?: string, tag?: string) {
    this.abortables.abort({tab, tag})
    const ctl = new AbortController()
    const id = this.abortables.add({
      abort: () => {
        console.log("aborted", tab, tag)
        ctl.abort()
      },
      tab,
      tag,
    })
    const cleanup = () => this.abortables.remove(id)
    return [ctl.signal, cleanup] as const
  }

  async query(body: string, opts: {id?: string; tabId?: string} = {}) {
    const zealot = await this.getZealot()
    const [signal, cleanup] = this.createAbortable(opts.tabId, opts.id)
    try {
      const resp = await zealot.query(body, {signal})
      resp.promise.finally(cleanup)
      return resp
    } catch (e) {
      cleanup()
      throw e
    }
  }

  select<T extends (s: State) => ReturnType<T>>(fn: T) {
    return fn(this.getState())
  }
}
