import {useDispatch} from "react-redux"
import React from "react"

import ErrorFactory from "../../src/js/models/ErrorFactory"
import Link from "../../src/js/components/common/Link"
import LoadFilesInput from "ppl/import/LoadFilesInput"
import Notice from "../../src/js/state/Notice"
import errors from "../../src/js/errors"
import ingestFiles from "../../src/js/flows/ingestFiles"
import refreshSpaceNames from "../../src/js/flows/refreshSpaceNames"
import {AppDispatch} from "../../src/js/state/types"
import {popNotice} from "../../src/js/components/PopNotice"

export default function TabImport() {
  const dispatch = useDispatch<AppDispatch>()

  function onChange(_e, files) {
    if (!files.length) return
    dispatch(ingestFiles(files))
      .then(() => {
        popNotice("Import complete.")
      })
      .catch((e) => {
        const regex = /(Failed to fetch)|(network error)/
        regex.test(e.cause.message)
          ? dispatch(Notice.set(errors.importInterrupt()))
          : dispatch(Notice.set(ErrorFactory.create(e.cause)))

        dispatch(refreshSpaceNames())
        console.error(e.message)
      })
  }

  return (
    <div className="input-methods">
      <section>
        <h2>Import Files</h2>
        <LoadFilesInput onChange={onChange} />
        <footer>
          <p>
            <b>Accepted formats:</b> .csv, .json, .parquet, .tsv,{" "}
            <Link href="https://github.com/brimdata/zq/blob/main/zng/docs/spec.md">
              .zng
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zq/blob/main/zng/docs/zson.md">
              .zson
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zq/blob/main/zst/README.md">
              .zst
            </Link>
          </p>
        </footer>
      </section>
    </div>
  )
}
