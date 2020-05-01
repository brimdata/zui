/* @flow */
import logsIngest from "./logsIngest"
import pcapIngest from "./pcapIngest"

export default {
  pcapIngest,
  logsIngest,
  spaceDeleted: (name: string) => ({
    type: "SpaceDeletedError",
    message: `The space "${name}" previously on this tab has been deleted.`
  })
}
