export type PacketsState = Download[]

export type Download = {
  uid: string
  percentComplete: number
  error: null | string
}

export type PacketsAction = PACKETS_REQUEST | PACKETS_RECEIVE | PACKETS_ERROR

export type PACKETS_REQUEST = {
  type: "PACKETS_REQUEST"
  uid: string
}

export type PACKETS_RECEIVE = {
  type: "PACKETS_RECEIVE"
  uid: string
  fileName: string
}

export type PACKETS_ERROR = {
  type: "PACKETS_ERROR"
  error: string
  uid: string
}
