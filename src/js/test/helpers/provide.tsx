import {Provider} from "react-redux"
import {ThemeProvider} from "styled-components"
import React from "react"

import {mount} from "enzyme"

import theme from "../../style-theme"
import AppRouter from "app/router/router"

export default function provide(store: any, children: any) {
  return mount(
    <Provider store={store}>
      <AppRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </AppRouter>
    </Provider>
  )
}
