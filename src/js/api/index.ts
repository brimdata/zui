import {Abortables} from "src/app/core/models/abortables"
import * as remote from "@electron/remote"
import path from "path"
import toast from "react-hot-toast"
import ingestFiles from "src/app/features/import/import-files"
import errors from "../errors"
import {getZealot} from "../flows/getZealot"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"
import Queries from "../state/Queries"
import {
  JSONGroup,
  parseJSONLib,
  serializeQueryLib,
} from "../state/Queries/parsers"
import {AppDispatch, State} from "../state/types"
import {QueriesApi} from "./queries"
import {
  CommandRegistry,
  ContextMenuRegistry,
  DetailCtxItemBuilder,
  LoaderRegistry,
  SearchCtxItemBuilder,
} from "./registries"
import {SearchesApi} from "./searches"
import {StorageApi} from "./storage"
import {ConfigsApi, ToolbarApi} from "./ui-apis"
import submitSearch from "src/app/query-home/flows/submit-search"
import SearchBar from "src/js/state/SearchBar"
import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import {forEach} from "lodash"
import QueryVersions from "../state/QueryVersions"

export default class BrimApi {
  public abortables = new Abortables()
  public commands = new CommandRegistry()
  public loaders = new LoaderRegistry()
  public contextMenus = {
    search: new ContextMenuRegistry<SearchCtxItemBuilder>(),
    detail: new ContextMenuRegistry<DetailCtxItemBuilder>(),
  }
  public toolbar: ToolbarApi
  public configs: ConfigsApi
  public storage: StorageApi
  public queries: QueriesApi
  public searches = new SearchesApi()

  public toast = toast

  /*
  TODO: store is made public only to make the initial plugin architecture
    migration easier, it will eventually be private
   */
  public dispatch: AppDispatch
  public getState: () => State

  constructor() {}

  init(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.getState = gs

    this.toolbar = new ToolbarApi(d, gs)
    this.configs = new ConfigsApi(d, gs)
    this.storage = new StorageApi(d, gs)
    this.queries = new QueriesApi(d, gs)
  }

  getZealot() {
    return this.dispatch(getZealot())
  }

  getTempDir() {
    return remote.app.getPath("temp")
  }

  getAppConfig() {
    return {
      dataRoot: path.join(remote.app.getPath("userData"), "data"),
      zdepsDirectory: path.join(
        remote.app.getAppPath().replace("app.asar", "app.asar.unpacked"),
        "zdeps"
      ),
    }
  }

  import(files: File[]): Promise<void> {
    return this.dispatch(ingestFiles(files))
      .then(() => {
        toast.success("Import complete.")
      })
      .catch((e) => {
        const cause = e.cause
        if (/(Failed to fetch)|(network error)/.test(cause.message)) {
          this.dispatch(Notice.set(errors.importInterrupt()))
        } else if (/format detection error/i.test(cause.message)) {
          this.dispatch(Notice.set(errors.formatDetection(cause.message)))
        } else {
          this.dispatch(Notice.set(ErrorFactory.create(e.cause)))
        }
        this.dispatch(syncPoolsData()).catch((e) => e)
        console.error(e.message)
      })
  }

  search(zed: string) {
    this.dispatch(SearchBar.changeSearchBarInput(zed))
    this.dispatch(submitSearch())
  }

  importQueries(file: File) {
    const {libRoot, versions} = parseJSONLib(file.path)
    this.dispatch(Queries.addItem(libRoot, "root"))
    forEach(versions, (vs, queryId) => {
      this.dispatch(QueryVersions.set({queryId, versions: [vs]}))
    })
    this.toast.success(`Imported ${libRoot.name}`)
  }

  exportQueries(groupId: string): JSONGroup {
    const group = Queries.getGroupById(groupId)(this.getState())
    const versions = QueryVersions.raw(this.getState())
    return serializeQueryLib(group, versions)
  }
}
