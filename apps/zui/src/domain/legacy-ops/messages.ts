import {zjson} from "@brimdata/zed-js"
import {MainObject} from "src/core/main/main-object"
import {OpEventContext} from "src/js/state/Current/selectors"
import {State} from "src/js/state/types"
import {Config} from "../configurations/plugin-api"
import {CompiledCorrelation} from "../correlations/plugin-api"
import {MenuItem} from "src/core/menu"
import {AnyAction} from "@reduxjs/toolkit"
import {LoadOptions} from "src/core/loader/types"
import {MainArgs} from "src/electron/run-main/args"
import {
  MenuItemConstructorOptions,
  MessageBoxOptions,
  MessageBoxReturnValue,
  OpenDialogReturnValue,
  PopupOptions,
  SaveDialogOptions,
  SaveDialogReturnValue,
} from "electron"
import {SearchAppMenuState} from "src/electron/windows/search/app-menu"
import {Pool} from "src/app/core/pools/pool"
import {Command} from "src/app/commands/command"

export type LegacyOperations = {
  autosaveOp: (windowId: string, windowState: State) => void
  closeWindow: () => void
  deletePoolOp: (lakeId: string, poolId: string) => void
  derivePoolNameOp: (files: string[], existing: string[]) => string
  emitRowDetailChangeOp: (event: OpEventContext, zjson: zjson.Obj) => void
  exportQueries: (groupId: string, filePath: string) => void
  exportResultsOp: (filePath: string, format: string) => void
  featureFlags: () => string[]
  getAppMeta: () => MainObject["appMeta"]
  getConfigurationsOp: () => Config[]
  getCorrelationsOp: () => CompiledCorrelation[]
  getGlobalState: () => State
  getMenuTemplateOp: (name: string) => MenuItem[]
  getWindowState: (id: string) => State
  dispatchGlobalFromWindow: (action: AnyAction) => void
  dispatchFromMain: (action: AnyAction) => void
  importQueries: (
    filePath: string
  ) => {error: string} | {size: number; id: string}
  invokeCommandOp: (id: string, args?: any[]) => any
  loadFilesOp: (options: LoadOptions) => void
  mainArgs: () => MainArgs
  moveToCurrentDisplay: () => void
  openAboutWindow: () => void
  "detailWindow.open": (opts: {value: zjson.Obj; url: string}) => void
  openDirectory: () => OpenDialogReturnValue
  openLinkOp: (url: string) => void
  openSearchWindow: () => void
  resetState: () => void
  runCommand: (id: string | Command<any, any>, ...args: any[]) => any
  setSecretOp: (key: string, val: string) => void
  getSecretOp: (key: string) => string
  deleteSecretOp: (key: string) => boolean
  showContextMenuOp: (
    template: MenuItemConstructorOptions[],
    opts: PopupOptions
  ) => void
  showMessageBoxOp: (opts: MessageBoxOptions) => MessageBoxReturnValue
  showPreferencesOp: () => void
  showReleaseNotes: () => void
  showSaveDialogOp: (opts: SaveDialogOptions) => SaveDialogReturnValue
  syncPoolOp: (lakeId: string, poolId: string) => Pool
  updatePluginLakeOp: (state: {lakeId: string}) => void
  updatePluginSessionOp: (state: {poolName: string; program: string}) => void
  updateSearchAppMenu: (id: string, state: SearchAppMenuState) => void
  whoisOp: (addr: string) => string
  windowInitialized: (id: string) => void
}
