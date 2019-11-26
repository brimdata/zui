/* @flow */
import {Provider} from "react-redux"
import React from "react"

import {mount} from "enzyme"

export default function provide(store: any, children: *) {
  // $FlowFixMe
  return mount(<Provider store={store}>{children}</Provider>)
}
