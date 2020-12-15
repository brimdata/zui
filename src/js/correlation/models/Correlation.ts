import {get} from "lodash"
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
      console.log("name is: ", this.r)
      if (this.r.has(name)) {
        const data = this.r.get(name)
        console.log("data is: ", data)
        if (data instanceof zng.Primitive) {
          return data.toString()
        } else {
          const value = data.getValue()
          console.log("value is: ", value)
          if (!value) return null
          return value.map((v) => v.toString()).join(" ")
        }
      }
    }
    return null
  }
}
