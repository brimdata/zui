
import { Space } from "../state/Spaces/types";
import { isNumber } from "../lib/is";
import brim from "./";

export default function space(info: Space) {
  return {
    ...info,
    isArchive() {
      return this.getType() === "archive";
    },
    hasIndex() {
      return info.storage_kind !== "filestore";
    },
    getType() {
      if (info.storage_kind === "filestore") return "space";
      if (info.parent_id) return "subspace";
      return "archive";
    },
    defaultSpanArgs() {
      if (recentDataExists(info.max_time)) {
        return ["now-30m", "now"];
      } else {
        let to = { sec: info.max_time.sec + 1, ns: 0 };
        let from = brim.time(to).subtract(30, "minutes").toTs();
        return [from, to];
      }
    },
    empty() {
      if (!info.min_time || !info.max_time) return true;
      return (info.min_time.sec === 0 && info.min_time.ns === 0 && info.max_time.sec === 0 && info.max_time.ns === 0);
    },
    everythingSpan() {
      let {
        min_time,
        max_time
      } = info;
      let from = brim.time(min_time).toTs();
      let to = brim.time(max_time).add(1, "ms").toTs();
      return [from, to];
    },
    ingesting() {
      return isNumber(info.ingest.progress);
    },
    ingestProgress() {
      return isNumber(info.ingest.progress) ? info.ingest.progress : 0;
    },
    queryable() {
      return !(this.ingesting() && this.empty());
    }
  };
}

function recentDataExists(ts) {
  let halfHour = 1000 * 60 * 30;
  return new Date() - brim.time(ts).toDate() < halfHour;
}