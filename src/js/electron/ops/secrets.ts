import keytar from "keytar"
import * as os from "os"
import {createOperation} from "../operations"

export const setSecretOp = createOperation(
  "setSecretOp",
  (_, key: string, val: string) => {
    return keytar.setPassword(key, os.userInfo().username, val)
  }
)

export const getSecretOp = createOperation("getSecretOp", (_, key: string) => {
  return keytar.getPassword(key, os.userInfo().username)
})

export const deleteSecretOp = createOperation(
  "deleteSecretOp",
  (_, key: string) => {
    return keytar.deletePassword(key, os.userInfo().username)
  }
)
