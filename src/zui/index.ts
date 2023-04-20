import {PanesApi} from "src/domain/panes/plugin-api"
import {ResultsApi} from "src/domain/results/plugin-api"

export * from "./menus"
export * from "./session"
export * from "./lake"
export * from "./commands"

export const results = new ResultsApi()
export const panes = new PanesApi()
