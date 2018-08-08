import {getCredentials} from "../reducers/boomdCredentials"

export const setBoomdCredentials = credentials => ({
  type: "BOOMD_CREDENTIALS_SET",
  credentials
})

export const connectedBoomd = () => ({type: "BOOMD_CONNECTED"})

export const setBoomdError = () => ({type: "BOOMD_ERROR_SET"})

export const connectingBoomd = () => ({type: "BOOMD_CONNECTING"})

export const connectBoomd = () => (dispatch, getState, api) => {
  dispatch(connectingBoomd())
  return new Promise((resolve, reject) => {
    api.onConnect(() => {
      dispatch(connectedBoomd())
      resolve()
    })
    api.onDisconnect(() => {
      dispatch(setBoomdError())
      reject()
    })
    api.connect(getCredentials(getState()))
  })
}
