import {BulletController} from "./controller"
import {ipc} from "./ipc"

class Application {
  controllers: typeof BulletController[] = []

  config(fn) {
    return fn(this)
  }

  boot() {
    ipc.listen()
  }
}

export const BulletApplication = new Application()
