import {render as rtlRender} from "@testing-library/react"
import React, {ComponentType, ReactElement} from "react"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {BrimProvider} from "src/app/core/context"

export function render(ui: ReactElement, {store, api}) {
  function Wrapper({children}) {
    return (
      <BrimProvider store={store} api={api}>
        <>
          {children}
          <HTMLContextMenu />
        </>
      </BrimProvider>
    )
  }

  return rtlRender(ui, {
    wrapper: Wrapper as ComponentType<React.PropsWithChildren<unknown>>,
  })
}
