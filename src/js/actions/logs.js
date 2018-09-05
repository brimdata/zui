export const requestLogs = () => ({
  type: "LOGS_REQUEST"
})

export const receiveLogs = tuples => ({
  type: "LOGS_RECEIVE",
  tuples
})

export const errorLogs = error => ({
  type: "LOGS_ERROR",
  error
})

export const successLogs = () => ({
  type: "LOGS_SUCCESS"
})
