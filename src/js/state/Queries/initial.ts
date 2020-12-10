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
      tags: ["test1"]
    },
    {
      id: "2",
      name: "Suricata",
      value: "event_type=alert",
      description: "",
      tags: ["test2"]
    },
    {
      id: "3",
      name: "Long connections",
      value: "_path=conn duration > 10",
      description: "",
      tags: ["test1", "test4"]
    }
  ]
})

export default init
