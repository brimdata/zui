import {EnvAboutApp, EnvProperties} from "./types"

export type EnvOperations = {
  "env.properties": () => EnvProperties
  "env.aboutApp": () => EnvAboutApp
}
