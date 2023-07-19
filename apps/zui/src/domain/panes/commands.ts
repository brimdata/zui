import {createCommand} from "src/core/command"
import {PaneName} from "src/js/state/Layout/types"
import {panes} from "src/zui"

export const activate = createCommand("panes.activate", (name: PaneName) => {
  panes.activate(name)
})
