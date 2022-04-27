import logsIngest from "./logsIngest"
import pcapIngest from "./pcapIngest"

export default {
  pcapIngest,
  logsIngest,
  poolDeleted: (id: string) => ({
    type: "PoolDeletedError",
    message: `The pool previously on this tab has been deleted.`,
    details: [`id: ${id}`],
  }),
  importInterrupt: () => ({
    type: "ImportInterruptError",
    message: "The import was interrupted.",
    details: ["To prevent this, keep your computer awake during the import."],
  }),
  formatDetection: (s: string) => ({
    type: "FormatDetectionError",
    message: "Format Detection Error",
    details: [s.replace("format detection error", "").trim()],
  }),
}
