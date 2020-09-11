import {getAllStates} from "../../test/helpers/getTestState"

export default function spacesStateId(sess: any) {
  for (let s of getAllStates(sess)) {
    for (let clusterId in s.spaces) {
      let cluster = s.spaces[clusterId]
      if (!cluster) continue

      for (let spaceId in cluster) {
        let space = cluster[spaceId]
        if (!space) continue

        space.id = space.name
        space.pcap_support = space.packet_support
        delete space.packet_support
      }
    }
  }

  return sess
}
