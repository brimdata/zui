import {get, isString} from "lodash"
import {zng} from "../../../../zealot/dist"

const specialUids = {
  files: "conn_uids",
  dhcp: "uids"
}

export class Correlation {
  constructor(private r: zng.Record) {}

  exists() {
    return !!(this.getCid() || this.getUid())
  }

  getIds() {
    return {cid: this.getCid(), uid: this.getUid()}
  }

  getCid() {
    return this.r.has("community_id")
      ? this.r.get("community_id").toString()
      : null
  }

  getUid() {
    if (this.r.has("_path")) {
      const path = this.r.get("_path").toString()
      const name = get(specialUids, path, "uid")
      if (this.r.has(name)) {
        const data = this.r.get(name)
        if (data.constructor && data.constructor.name === "Primitive") {
          return data.toString()
        } else {
          const value = data.getValue()
          if (!value) return null
          if (isString(value)) return value
          return value.map((v) => v.toString()).join(" ")
        }
      }
    }
    return null
  }
}
