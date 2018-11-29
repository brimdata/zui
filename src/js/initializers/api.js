/* @flow */

import Client from "boom-js-client"
import {getCredentials} from "../reducers/boomdCredentials"
import type {State} from "../reducers/types"

export default (state: ?State) => {
  const creds = state && getCredentials(state)
  return new Client({...creds, timeout: 60000})
}
