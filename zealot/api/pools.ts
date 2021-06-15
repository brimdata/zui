import {PoolArgs} from "../types"

export default {
  list() {
    return {
      headers: new Headers({Accept: "application/json"}),
      path: "/pool",
      method: "GET"
    }
  },
  get(poolId: string) {
    return {
      headers: new Headers({Accept: "application/json"}),
      path: `/pool/${poolId}`,
      method: "GET"
    }
  },
  stats(poolId: string) {
    return {
      headers: new Headers({Accept: "application/x-zjson"}),
      path: `/pool/${poolId}/stats`,
      method: "GET"
    }
  },
  create(args: PoolArgs) {
    args.layout = args.layout || {order: "desc", keys: [["ts"]]}
    return {
      headers: new Headers({Accept: "application/json"}),
      path: "/pool",
      method: "POST",
      body: JSON.stringify(args)
    }
  },
  delete(poolId: string) {
    return {
      headers: new Headers({Accept: "application/json"}),
      path: `/pool/${poolId}`,
      method: "DELETE"
    }
  },
  update(poolId: string, args: Partial<PoolArgs>) {
    return {
      headers: new Headers({Accept: "application/json"}),
      path: `/pool/${poolId}`,
      method: "PUT",
      body: JSON.stringify(args)
    }
  }
}
