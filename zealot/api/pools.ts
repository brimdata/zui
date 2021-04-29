import {PoolArgs} from "../types"

export default {
  list() {
    return {
      path: "/pool",
      method: "GET"
    }
  },
  get(poolId: string) {
    return {
      path: `/pool/${poolId}`,
      method: "GET"
    }
  },
  create(args: PoolArgs) {
    return {
      path: "/pool",
      method: "POST",
      body: JSON.stringify(args)
    }
  },
  delete(poolId: string) {
    return {
      path: `/pool/${poolId}`,
      method: "DELETE"
    }
  },
  update(poolId: string, args: Partial<PoolArgs>) {
    return {
      path: `/pool/${poolId}`,
      method: "PUT",
      body: JSON.stringify(args)
    }
  }
}
