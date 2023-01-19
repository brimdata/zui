export type Controller<T> = {
  value?: T
  onChange?: (next: T) => void
}

export type ControllerOpts<T> = {
  value?: T
  onChange?: (state: T) => void
  defaultValue?: T
  onDidChange?: (state: T) => void
}

export type MakeControllers<T> = {
  [K in keyof T as `${K}State`]: Controller<T[K]>
}
