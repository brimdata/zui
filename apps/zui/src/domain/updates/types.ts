export type UpdateMode = "manual" | "startup" | "default"

export interface Updater {
  check(): Promise<string | null>
  install(onProgress: (percent: number) => void): Promise<void>
}
