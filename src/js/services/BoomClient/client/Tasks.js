/* @flow */

import SubClient from "./SubClient"

export default class Tasks extends SubClient {
  list() {
    return this.base.send({
      method: "GET",
      path: "/task"
    })
  }
}
