import {EnvApi} from "./env/plugin-api"
import {LoadersApi} from "./loaders/plugin-api"
import {PanesApi} from "./panes/plugin-api"
import {ResultsApi} from "./results/plugin-api"
import {SessionApi} from "./session/plugin-api"
import {WindowApi} from "./window/plugin-api"

export const results = new ResultsApi()
export const panes = new PanesApi()
export const window = new WindowApi()
export const env = new EnvApi()
export const loaders = new LoadersApi()
export const session = new SessionApi()
