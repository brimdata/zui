export class ViewIpc {
  request(path: string, params: any) {
    return global.zui.invoke("bullet:view-request", path, params)
  }
}

export const ipc = new ViewIpc()
