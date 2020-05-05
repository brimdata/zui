/* @flow */
import logsIngest from "./logsIngest"
import pcapIngest from "./pcapIngest"

export default {
  pcapIngest,
  logsIngest,
  spaceDeleted: (name: string) => ({
    type: "SpaceDeletedError",
    message: `The space "${name}" previously on this tab has been deleted.`
  }),
  importInterrupt: () => ({
    type: "ImportInterruptError",
    message: "The import was interrupted.",
    details: ["To prevent this, keep your computer awake during the import."]
  })
}
