import {ipcMain, ipcRenderer} from "electron"

function getChannel(klass, method) {
  return `${klass}#${method}`
}

export function serve(instance) {
  const methods = Object.getOwnPropertyNames(instance.constructor.prototype)

  methods.forEach((method) => {
    if (method === "constructor") return
    const channel = getChannel(instance.constructor.name, method)
    return ipcMain.handle(channel, (event, ...args) =>
      instance[method](...args)
    )
  })
}
type AnyFn = (...args: any) => any
type Promisify<Fn extends AnyFn> = (
  ...args: Parameters<Fn>
) => Promise<ReturnType<Fn>>
type PromisifyMethods<T> = {
  [P in keyof T]: T[P] extends AnyFn ? Promisify<T[P]> : T[P]
}

interface Klass {
  prototype: object
  name: string
  new (...args: any): any
}

export function createClient<T extends Klass>(
  klass: T
): PromisifyMethods<InstanceType<T>> {
  const methods = Object.getOwnPropertyNames(klass.prototype)

  return methods.reduce((client, method) => {
    if (method === "constructor") return client
    const channel = getChannel(klass.name, method)
    Object.defineProperty(client, method, {
      value: (...args) => ipcRenderer.invoke(channel, ...args),
    })
    return client
  }, {} as PromisifyMethods<InstanceType<T>>)
}
