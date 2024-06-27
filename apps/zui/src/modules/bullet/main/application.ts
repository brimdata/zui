import {ipc} from "./ipc"

class Application {
  controllers: any[] = []

  config(fn) {
    return fn(this)
  }

  boot() {
    ipc.listen()
  }
}

export const BulletApplication = new Application()
