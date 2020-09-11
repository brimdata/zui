import {Provider} from "react-redux"
import {ThemeProvider} from "styled-components"
import React from "react"

import {mount} from "enzyme"

import theme from "../../style-theme"

export default function provide(store: any, children: any) {
  // $FlowFixMe
  return mount(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  )
}
