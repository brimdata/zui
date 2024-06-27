import {reducer} from "./reducer"

export type PoolSetting = {
  id: string
  timeField?: string
  colorField?: string
  colorMap?: Record<string, string>
}

export type PoolSettingsState = ReturnType<typeof reducer>
