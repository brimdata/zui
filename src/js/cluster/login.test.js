/* @flow */

import {login} from "./login"
import initTestStore from "../test/initTestStore"

let cluster = {
  host: "localhost",
  port: "9867",
  username: "james",
  password: "kerr"
}

test("login", () => {
  let store = initTestStore()
  store.dispatch(login(cluster))
})
