export type GenericQueryPin = {
  type: "generic"
  value: string
  label?: string
}

export type FromQueryPin = {
  type: "from"
  value: string
}

export type TimeRangeQueryPin = {
  type: "time-range"
  from: Date
  to: Date
}

export type QueryPin = GenericQueryPin | FromQueryPin | TimeRangeQueryPin
