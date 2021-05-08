import SpaceMigration from "app/space-migration"
import LoadFilesInput from "ppl/import/LoadFilesInput"
import React from "react"
import toast from "react-hot-toast"
import {useDispatch} from "react-redux"
import Link from "../../src/js/components/common/Link"
import errors from "../../src/js/errors"
import ingestFiles from "../../src/js/flows/ingestFiles"
import refreshPoolNames from "../../src/js/flows/refreshPoolNames"
import ErrorFactory from "../../src/js/models/ErrorFactory"
import Notice from "../../src/js/state/Notice"
import {AppDispatch} from "../../src/js/state/types"

export default function TabImport() {
  const dispatch = useDispatch<AppDispatch>()

  function onChange(_e, files) {
    if (!files.length) return
    dispatch(ingestFiles(files))
      .then(() => {
        toast.success("Import complete.")
      })
      .catch((e) => {
        const regex = /(Failed to fetch)|(network error)/
        regex.test(e.cause.message)
          ? dispatch(Notice.set(errors.importInterrupt()))
          : dispatch(Notice.set(ErrorFactory.create(e.cause)))

        dispatch(refreshPoolNames())
        console.error(e.message)
      })
  }

  return (
    <div className="input-methods">
      <SpaceMigration />
      <section>
        <h2>Import Files</h2>
        <LoadFilesInput onChange={onChange} />
        <footer>
          <p>
            <b>Accepted formats:</b> .csv, .json, .parquet, .tsv,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zng.md">
              .zng
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zson.md">
              .zson
            </Link>
            ,{" "}
            <Link href="https://github.com/brimdata/zed/blob/main/docs/formats/zst.md">
              .zst
            </Link>
          </p>
        </footer>
      </section>
    </div>
  )
}
