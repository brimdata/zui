import {Menu} from "./menu"

export class MenuManager<Context> {
  map = new Map<string, Menu<any>>()
  ctx: Context | null = null

  get context() {
    if (this.ctx) return this.ctx
    throw new Error("First provide a context before building a menu")
  }

  setContext(ctx: Context) {
    this.ctx = ctx
  }

  add(menu: Menu<any>) {
    this.map.set(menu.id, menu)
  }

  build(id: string, ...args: any[]) {
    const menu = this.map.get(id)
    if (menu) {
      return menu.build(...args).toElectron()
    } else {
      throw new Error("No menu with id: " + id)
    }
  }
}
