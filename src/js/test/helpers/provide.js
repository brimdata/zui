/* @flow */
import {Provider} from "react-redux"
import React from "react"

import {mount} from "enzyme"

import type {Store} from "../../state/types"

export default function provide(store: Store, children: *) {
  // $FlowFixMe
  return mount(<Provider store={store}>{children}</Provider>)
}
