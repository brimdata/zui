import {ResponseFormat} from "@brimdata/zed-js"
import {
  exportToClipboard,
  exportToFile,
  exportToPool,
} from "src/domain/results/handlers"

export class ExportModalController {
  // add default for zng or the last most recent format
  static formatOptions = [
    {value: "arrows", label: "Arrow IPC Stream"},
    {value: "csv", label: "CSV"},
    {value: "json", label: "JSON"},
    {value: "ndjson", label: "NDJSON"},
    {value: "tsv", label: "TSV"},
    {value: "vng", label: "VNG"},
    {value: "zeek", label: "Zeek"},
    {value: "zjson", label: "ZJSON"},
    {value: "zng", label: "ZNG"},
    {value: "zson", label: "ZSON"},
  ]

  constructor(
    public format: ResponseFormat,
    public poolId: string | null,
    public close: any
  ) {}

  get formatOptions() {
    return ExportModalController.formatOptions
  }

  toClipboard() {
    exportToClipboard(this.format)
  }

  async toFile() {
    await exportToFile(this.format)
    this.close()
  }

  async toPool() {
    await exportToPool(this.poolId)
    this.close()
  }
}
