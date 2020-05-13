/* @flow */
import type {ZealotSearchArgs} from "./"

export default {
  searchArgs(): ZealotSearchArgs {
    return {
      from: "now - 30d",
      to: "now",
      spaceId: "default"
    }
  },
  host(hostUrl: string): string {
    let [host, port] = hostUrl.split(":")
    port = port ? port : "9867"
    return host + ":" + port
  }
}
