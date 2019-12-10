/* @flow */

import SubClient from "./SubClient"

export default class Descriptors extends SubClient {
  list(spaceName: string) {
    return this.base.send({
      method: "GET",
      path: `/space/${spaceName}/descriptor`
    })
  }

  get(spaceName: string, td: number | string) {
    return this.base.send({
      method: "GET",
      path: `/space/${spaceName}/descriptor/${td}`
    })
  }
}
