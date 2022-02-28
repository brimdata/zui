import Markdown from "src/app/core/components/markdown"
import useKeybinding from "src/app/core/hooks/use-keybinding"
import Icon from "src/app/core/Icon"
import parseSearchParams from "src/app/core/utils/parse-search-params"
import ToolbarButton from "src/app/toolbar/button"
import {ipcRenderer} from "electron"
import React, {useEffect} from "react"
import {render} from "react-dom"
import theme from "src/js/style-theme"
import {ThemeProvider} from "styled-components"
import {BG} from "./dialog.style"
import {closeChannel, readyChannel} from "./index"

const ROOT_ID = "root"
/**
 * These come from the main process
 */
const {title, content, id} = parseSearchParams()

/**
 * This can expand and can offer custom buttons, but for now it just lets
 * you render markdown in a simple error dialog window.
 */
function ErrorDialog() {
  const close = () => ipcRenderer.send(closeChannel(id))
  const ready = (height: number) => ipcRenderer.send(readyChannel(id), height)

  useEffect(() => {
    ready(document.getElementById(ROOT_ID).clientHeight)
  }, [])

  useKeybinding(["meta+.", "esc", "enter"], close)

  return (
    <ThemeProvider theme={theme}>
      <BG>
        <main>
          <Icon name="warning" className="icon" />
          <div>
            <h1>{title}</h1>
            <Markdown>{content}</Markdown>
          </div>
        </main>
        <footer>
          <ToolbarButton text="OK" onClick={() => close()} isPrimary />
        </footer>
      </BG>
    </ThemeProvider>
  )
}

render(<ErrorDialog />, document.getElementById(ROOT_ID))
