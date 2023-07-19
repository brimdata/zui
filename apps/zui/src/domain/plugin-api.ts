import {ConfigurationsApi} from "./configurations/plugin-api"
import {CorrelationsApi} from "./correlations/plugin-api"
import {EnvApi} from "./env/plugin-api"
import {LoadersApi} from "./loaders/plugin-api"
import {PanesApi} from "./panes/plugin-api"
import {PoolsApi} from "./pools/plugin-api"
import {ResultsApi} from "./results/plugin-api"
import {SessionApi} from "./session/plugin-api"
import {WindowApi} from "./window/plugin-api"

export type {Config} from "./configurations/plugin-api"

export const results = new ResultsApi()
export const panes = new PanesApi()
export const window = new WindowApi()
export const env = new EnvApi()
export const loaders = new LoadersApi()
export const session = new SessionApi()
export const correlations = new CorrelationsApi()
export const configurations = new ConfigurationsApi()
export const pools = new PoolsApi()
