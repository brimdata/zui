import {remote} from "electron"
import path from "path"
import toast from "react-hot-toast"
import {getZealot} from "../flows/getZealot"
import {AppDispatch, State} from "../state/types"
import Current from "../state/Current"
import {CommandRegistry, LoaderRegistry} from "./registries"
import {ToolbarApi} from "./ui-apis"

export default class BrimApi {
  public commands = new CommandRegistry()
  public loaders = new LoaderRegistry()
  public toolbar = new ToolbarApi()
  // public contextMenu = new ContextMenuApi()
  public toast = toast

  /*
  TODO: store is made public only to make the initial plugin architecture
    migration easier, it will eventually be private
   */
  public dispatch: AppDispatch
  public getState: () => State

  constructor() {}

  public setStoreArgs(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.getState = gs

    this.toolbar.setStoreArgs(d, gs)
  }

  public getCurrent() {
    const state = this.getState()
    const space = Current.getSpace(state)
    const ws = Current.getWorkspace(state)
    return {
      spaceId: space.id,
      spaceName: space.name,
      workspaceId: ws.id,
      workspaceName: ws.name
    }
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
