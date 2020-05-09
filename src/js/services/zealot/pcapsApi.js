/* @flow */

export type PcapsGetArgs = {spaceID: string}
export type PcapsPostArgs = {spaceID: string, path: string}

export default {
  get({spaceID}: PcapsGetArgs) {
    return {
      method: "GET",
      path: `/space/${encodeURIComponent(spaceID)}/pcap`
    }
  },
  post({spaceID, path}: PcapsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceID)}/pcap`,
      body: JSON.stringify({path})
    }
  }
}
