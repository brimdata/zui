import LoadFilesInput from "ppl/import/LoadFilesInput"
import React from "react"
import toast from "react-hot-toast"
import {useDispatch} from "react-redux"
import {TransactionError} from "src/js/lib/transaction"
import Link from "../../src/js/components/common/Link"
import errors from "../../src/js/errors"
import ingestFiles from "../../src/js/flows/ingestFiles"
import refreshPoolNames from "../../src/js/flows/refreshPoolNames"
import ErrorFactory from "../../src/js/models/ErrorFactory"
import Notice from "../../src/js/state/Notice"
import {AppDispatch} from "../../src/js/state/types"

function handleError(e: TransactionError, dispatch: AppDispatch) {
  const cause = e.cause
  if (/(Failed to fetch)|(network error)/.test(cause.message)) {
    dispatch(Notice.set(errors.importInterrupt()))
  } else if (/format detection error/i.test(cause.message)) {
    dispatch(Notice.set(errors.formatDetection(cause.message)))
  } else {
    dispatch(Notice.set(ErrorFactory.create(e.cause)))
  }

  dispatch(refreshPoolNames())
  console.error(e.message)
}

export default function TabImport() {
  const dispatch = useDispatch<AppDispatch>()

  function onChange(_e, files) {
    if (!files.length) return
    dispatch(ingestFiles(files))
      .then(() => toast.success("Import complete."))
      .catch((e) => handleError(e, dispatch))
  }

  return (
    <div className="input-methods">
      <section>
        <h2>Import Files</h2>
        <LoadFilesInput onChange={onChange} />
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
          <Link href="https://github.com/brimdata/brim/wiki/Importing-CSV%2C-JSON%2C-Parquet%2C-and-ZST">
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
