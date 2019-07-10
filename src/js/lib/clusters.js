/* @flow */

import type {Cluster} from "../state/clusters/types"

export function getClusterKey({host, port, username}: Cluster) {
  return [host, port, username].join(":")
}
