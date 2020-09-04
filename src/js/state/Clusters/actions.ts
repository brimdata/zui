
import { CLUSTER_ADD, CLUSTER_REMOVE, Cluster } from "./types";

export default {
  add(cluster: Cluster): CLUSTER_ADD {
    return { type: "CLUSTER_ADD", cluster };
  },
  remove(id: string): CLUSTER_REMOVE {
    return { type: "CLUSTER_REMOVE", id };
  }
};