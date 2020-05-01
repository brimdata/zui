/* @flow */

import type {CreateSpaceBody} from "../types"
import SubClient from "./SubClient"

export default class Spaces extends SubClient {
  list() {
    return this.base.send({
      method: "GET",
      path: "/space"
    })
  }

  get(name: string) {
    return this.base.send({
      method: "GET",
      path: `/space/${encodeURIComponent(name)}`
    })
  }

  create(space: CreateSpaceBody) {
    return this.base.send({
      method: "POST",
      path: "/space",
      payload: space
    })
  }

  delete(name: string) {
    return this.base.send({
      method: "DELETE",
      path: `/space/${encodeURIComponent(name)}`
    })
  }
}
