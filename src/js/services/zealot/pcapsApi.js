/* @flow */

export type PcapsGetArgs = {space: string}
export type PcapsPostArgs = {space: string, path: string}

export default {
  get({space}: PcapsGetArgs) {
    return {
      method: "GET",
      path: `/space/${space}/packet`
    }
  },
  post({space, path}: PcapsPostArgs) {
    return {
      method: "POST",
      path: `/space/${space}/packet`,
      body: JSON.stringify({path})
    }
  }
}
