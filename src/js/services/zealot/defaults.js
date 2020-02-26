/* @flow */
export default {
  searchArgs() {
    return {
      from: "now - 30d",
      to: "now",
      space: "default",
      stream: true
    }
  },
  host(hostUrl: string) {
    let [host, port] = hostUrl.split(":")
    port = port ? port : "9867"
    return host + ":" + port
  }
}
