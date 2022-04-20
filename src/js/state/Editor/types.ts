export type GenericQueryPin = {
  type: "generic"
  value: string
  label?: string
}

export type FromQueryPin = {
  type: "from"
  value: string
}

export type QueryPin = GenericQueryPin | FromQueryPin
