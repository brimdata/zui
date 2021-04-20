import {get} from "lodash"
import {ZedArray, ZedPrimitive, ZedRecord, ZedSet} from "zealot/zed"

const specialUids = {
  files: "conn_uids",
  dhcp: "uids"
}

export class Correlation {
  constructor(private r: ZedRecord) {}

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
        if (data instanceof ZedPrimitive) {
          return data.toString()
        } else if (data instanceof ZedArray || data instanceof ZedSet) {
          const uids = data.items.map((item) => {
            if (item instanceof ZedPrimitive) return item.toString()
            else return ""
          })
          return uids.join(" ")
        }
      }
    }
    return null
  }
}
