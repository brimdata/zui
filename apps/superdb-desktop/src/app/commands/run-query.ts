import {submitSearch} from "src/domain/session/handlers"
import {createCommand} from "./command"

export const runQuery = createCommand("submitSearch", () => {
  submitSearch()
})
