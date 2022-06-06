import LoadFilesInput from "src/ppl/import/LoadFilesInput"
import React from "react"
import Link from "src/js/components/common/Link"
import links from "../core/links"
import {Content} from "src/js/components/Content"
import styled from "styled-components"

const BG = styled.div`
  padding: 24px;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
`

export default function TabImport() {
  return (
    <BG>
      <Content>
        <h2>New Pool</h2>
        <p>Create a new pool by loading data.</p>
        <LoadFilesInput />
        <footer>
          <p>
            <b>Accepted formats:</b>{" "}
            <Link href="https://tools.ietf.org/html/rfc4180">CSV</Link>,{" "}
            <Link href="https://www.json.org/json-en.html">JSON</Link>,{" "}
            <Link href="http://ndjson.org/">NDJSON</Link>,{" "}
            <Link href="https://docs.zeek.org/en/current/log-formats.html#zeek-tsv-format-logs">
              Zeek TSV
            </Link>
            , <Link href={links.ZED_DOCS_FORMATS_ZNG}>ZNG</Link>,{" "}
            <Link href={links.ZED_DOCS_FORMATS_ZSON}>ZSON</Link>
          </p>
          See{" "}
          <Link href="https://github.com/brimdata/brim/wiki/Importing-Parquet-and-ZST">
            docs
          </Link>{" "}
          for Zed platform support for{" "}
          <Link href="https://parquet.apache.org/">Parquet</Link> and{" "}
          <Link href={links.ZED_DOCS_FORMATS_ZST}>ZST</Link> formats.
        </footer>
      </Content>
    </BG>
  )
}
