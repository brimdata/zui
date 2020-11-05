import windowManager, {$WindowManager} from "./tron/windowManager"
import isDev from "./isDev"
import {installExtensions} from "./extensions"
import {SessionState} from "./tron/formatSessionState"

export class Brim {
  readonly windows: $WindowManager
  readonly data: SessionState | undefined

  constructor(data?: SessionState) {
    this.data = data
    this.windows = windowManager()
  }

  async start() {
    if (this.isDev()) await installExtensions()
    this.windows.init(this.data)
  }

  activate() {
    if (this.windows.count() === 0) this.windows.init()
  }

  isDev() {
    return isDev
  }
}
