import {SecretsDeleteKeyMsg, SecretsGetKeyMsg, SecretsSetKeyMsg} from "../types"

export default {
  setKey(key: string, val: string): SecretsSetKeyMsg {
    return {
      channel: "secrets:setKey",
      key,
      val,
    }
  },
  getKey(key: string): SecretsGetKeyMsg {
    return {
      channel: "secrets:getKey",
      key,
    }
  },
  deleteKey(key: string): SecretsDeleteKeyMsg {
    return {
      channel: "secrets:deleteKey",
      key,
    }
  },
}
