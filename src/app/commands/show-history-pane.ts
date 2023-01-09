import {createCommand} from "./command"

export const showHistoryPane = createCommand("showHistoryPane", ({api}) =>
  api.layout.activatePane("history")
)
