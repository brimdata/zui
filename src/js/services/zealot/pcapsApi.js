/* @flow */

export type PcapsGetArgs = {spaceId: string}
export type PcapsPostArgs = {spaceId: string, path: string}

export default {
  get({spaceId}: PcapsGetArgs) {
    return {
      method: "GET",
      path: `/space/${encodeURIComponent(spaceId)}/pcap`
    }
  },
  post({spaceId, path}: PcapsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/pcap`,
      body: JSON.stringify({path})
    }
  }
}
