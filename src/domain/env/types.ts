import env from "src/app/core/env"

export type EnvProperties = typeof env
export type EnvAboutApp = {
  version: string
  acknowledgementsPath: string
  licensePath: string
  website: string
  repository: string
}
