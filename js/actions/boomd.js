import {getCredentials} from "../reducers/boomdCredentials"

export const setBoomdCredentials = credentials => ({
  type: "BOOMD_CREDENTIALS_SET",
  credentials
})

export const connectedBoomd = () => ({type: "BOOMD_CONNECTED"})

export const setBoomdError = error => ({type: "BOOMD_ERROR_SET", error})

export const connectingBoomd = () => ({type: "BOOMD_CONNECTING"})

export const connectBoomd = () => (dispatch, getState, api) => {
  dispatch(connectingBoomd())

  return api
    .connect(getCredentials(getState()))
    .then(res => {
      if (res.status === 401)
        dispatch(setBoomdError("Incorrect user and pass combination."))
      else dispatch(connectedBoomd())
    })
    .catch(res => {
      dispatch(setBoomdError("No server running at that host and port."))
    })
}
