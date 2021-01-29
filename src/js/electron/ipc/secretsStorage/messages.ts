import {
  SecretsStorageDeleteKeyMsg,
  SecretsStorageGetKeyMsg,
  SecretsStorageSetKeyMsg
} from "../types"

export default {
  setKey(key: string, val: string): SecretsStorageSetKeyMsg {
    return {
      channel: "secretStorage:setKey",
      key,
      val
    }
  },
  getKey(key: string): SecretsStorageGetKeyMsg {
    return {
      channel: "secretStorage:getKey",
      key
    }
  },
  deleteKey(key: string): SecretsStorageDeleteKeyMsg {
    return {
      channel: "secretStorage:deleteKey",
      key
    }
  }
}
