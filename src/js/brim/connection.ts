import {Cluster} from "../state/Clusters/types"

export default function connection(conn: Cluster) {
  return {
    ...conn,
    getAddress(): string {
      return [this.host, this.port].join(":")
    },
    serialize(): Cluster {
      return {
        host: this.host,
        id: this.id,
        name: this.name,
        password: this.password,
        port: this.port,
        username: this.username
      }
    }
  }
}
