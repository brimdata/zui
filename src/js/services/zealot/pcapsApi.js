/* @flow */

export type PcapsGetArgs = {space: string}
export type PcapsPostArgs = {space: string, path: string}

export default {
  get({space}: PcapsGetArgs) {
    return {
      method: "GET",
      path: `/space/${encodeURIComponent(space)}/pcap`
    }
  },
  post({space, path}: PcapsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(space)}/pcap`,
      body: JSON.stringify({path})
    }
  }
}
