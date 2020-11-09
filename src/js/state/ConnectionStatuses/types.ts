export type ConnectionStatusesState = {
  [clusterId: string]: ConnectionStatus
}

export type ConnectionStatus = "connected" | "disconnected"

export type ConnectionStatusesAction =
  | CONNECTION_STATUSES_SET
  | CONNECTION_STATUSES_REMOVE

export type CONNECTION_STATUSES_SET = {
  type: "CONNECTION_STATUSES_SET"
  connId: string
  status: ConnectionStatus
}

export type CONNECTION_STATUSES_REMOVE = {
  type: "CONNECTION_STATUSES_REMOVE"
  connId: string
}
