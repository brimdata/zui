import newHeaders from "./headers"
import {PoolArgs, PoolLoadArgs} from "../types"

export default {
  list() {
    return {
      headers: newHeaders(),
      path: "/pool",
      method: "GET"
    }
  },
  get(poolId: string) {
    return {
      headers: newHeaders(),
      path: `/pool/${poolId}`,
      method: "GET"
    }
  },
  stats(poolId: string) {
    return {
      headers: newHeaders({Accept: "application/x-zjson"}),
      path: `/pool/${poolId}/stats`,
      method: "GET"
    }
  },
  create(args: PoolArgs) {
    args.layout = args.layout || {order: "desc", keys: [["ts"]]}
    return {
      headers: newHeaders(),
      path: "/pool",
      method: "POST",
      body: JSON.stringify(args)
    }
  },
  delete(poolId: string) {
    return {
      headers: newHeaders(),
      path: `/pool/${poolId}`,
      method: "DELETE"
    }
  },
  update(poolId: string, args: Partial<PoolArgs>) {
    return {
      headers: newHeaders(),
      path: `/pool/${poolId}`,
      method: "PUT",
      body: JSON.stringify(args)
    }
  },
  load(poolId: string, branch: string, args: PoolLoadArgs) {
    const {data, signal, ...rest} = args
    return {
      headers: newHeaders({"Zed-Commit": JSON.stringify(rest)}),
      path: `/pool/${poolId}/branch/${encodeURIComponent(branch)}`,
      method: "POST",
      body: data,
      signal
    }
  }
}
