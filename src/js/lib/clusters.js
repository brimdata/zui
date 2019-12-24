/* @flow */

import type {Cluster} from "../state/clusters/types"

export function getClusterKey({host, port, username}: Cluster) {
  return [host, port, username].join(":")
}

let data = {
  tabs: {
    t1: {
      id: "tz",
      search: {
        space: "default",
        cluster: "c1"
      }
    }
  },
  clusters: {
    c1: {
      id: "c1",
      host: "localhost",
      port: "9867",
      username: "james",
      password: "",
      spaces: {
        default: null,
        corelight: null,
        hq_integration: null
      }
    }
  }
}
