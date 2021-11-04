import LoadFilesInput from "ppl/import/LoadFilesInput"
import React from "react"
import Link from "../../src/js/components/common/Link"

export default function TabImport() {
  return (
    <div className="input-methods">
      <section>
        <h2>Import Files</h2>
        <LoadFilesInput />
        <footer>
          <p>
            <b>Accepted formats:</b>{" "}
            <Link href="http://ndjson.org/">NDJSON</Link>,{" "}
            <Link href="https://docs.zeek.org/en/current/log-formats.html#zeek-tsv-format-logs">
              Zeek TSV
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zng.md">
              ZNG
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zson.md">
              ZSON
            </Link>
          </p>
          See{" "}
          <Link href="https://github.com/brimdata/brim/wiki/Importing-CSV%2C-Parquet%2C-and-ZST">
            docs
          </Link>{" "}
          for Zed platform support for{" "}
          <Link href="https://tools.ietf.org/html/rfc4180">CSV</Link>,{" "}
          <Link href="https://parquet.apache.org/">Parquet</Link>, and{" "}
          <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zst.md">
            ZST
          </Link>{" "}
          formats.
        </footer>
      </section>
    </div>
  )
}
