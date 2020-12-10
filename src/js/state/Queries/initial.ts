import {QueriesState} from "./types"

const init = (): QueriesState => ({
  id: "root",
  name: "root",
  items: [
    {
      id: "1",
      name: "Count by Path",
      value: "* | count() by _path",
      description: "",
      tags: []
    },
    {
      id: "2",
      name: "Suricata",
      value: "event_type=alert",
      description: "",
      tags: []
    },
    {
      id: "3",
      name: "Long connections",
      value: "_path=conn duration > 10",
      description: "",
      tags: []
    }
  ]
})

export default init
