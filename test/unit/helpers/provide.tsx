import {Provider} from "react-redux"
import {ThemeProvider} from "styled-components"
import React from "react"

import theme from "../../../src/js/style-theme"
import AppRouter from "app/router/app-router"
import {render} from "@testing-library/react"

export default function provide(store: any, children: any) {
  return render(
    <Provider store={store}>
      <AppRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </AppRouter>
    </Provider>
  )
}
