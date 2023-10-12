import {LoadOptions} from "./types"
import {nanoid} from "@reduxjs/toolkit"
import Loads from "src/js/state/Loads"
import {syncPoolOp} from "src/electron/ops/sync-pool-op"
import {SearchWindow} from "src/electron/windows/search/search-window"
import {MainObject} from "../../core/main/main-object"

export class LoadContext {
  private ctl = new AbortController()
  private id = nanoid()
  private window: SearchWindow

  constructor(public main: MainObject, public opts: LoadOptions) {
    this.window = main.windows.find(opts.windowId) as SearchWindow
    if (!this.window) throw new Error("No window with id " + opts.windowId)
  }

  createClient() {
    return this.main.createClient(this.lakeId)
  }

  async setup() {
    this.window.loadsInProgress++
    this.main.abortables.add({id: this.id, abort: () => this.ctl.abort()})
    this.main.dispatch(
      Loads.create({
        id: this.id,
        poolId: this.opts.poolId,
        progress: 0,
        files: this.opts.files,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        abortedAt: null,
        errors: [],
      })
    )
  }

  async teardown() {
    this.window.loadsInProgress = Math.max(0, this.window.loadsInProgress - 1)
    this.main.abortables.remove(this.id)
    console.log("teardown", {
      id: this.id,
      changes: {finishedAt: new Date().toISOString()},
    })

    this.main.dispatch(
      Loads.update({
        id: this.id,
        changes: {finishedAt: new Date().toISOString()},
      })
    )
    const load = Loads.find(this.main.store.getState(), this.id)
    console.log(load)
  }

  onProgress(progress: number) {
    this.main.dispatch(Loads.update({id: this.id, changes: {progress}}))
  }

  onWarning(warning: string) {
    const load = Loads.find(this.main.store.getState(), this.id)
    console.log(load)
    const errors = [...load.errors, warning]
    console.log("on warning", errors)
    this.main.dispatch(Loads.update({id: this.id, changes: {errors}}))
  }

  async onPoolChanged() {
    await syncPoolOp(this.opts.lakeId, this.opts.poolId)
  }

  abort() {
    this.ctl.abort()
  }

  get signal() {
    return this.ctl.signal
  }

  get files() {
    return this.opts.files
  }

  get lakeId() {
    return this.opts.lakeId
  }

  get poolId() {
    return this.opts.poolId
  }

  get branch() {
    return this.opts.branch
  }

  get format() {
    return this.opts.format ?? "auto"
  }

  get shaper() {
    return this.opts.shaper ?? "*"
  }

  get author() {
    return this.opts.author ?? "(None)"
  }

  get body() {
    return this.opts.body ?? "(Empty)"
  }
}
