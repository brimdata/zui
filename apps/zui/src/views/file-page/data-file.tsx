import {basename} from "path"
import {useParams} from "react-router"
import {IconButton} from "src/components/icon-button"
import {Results, useResultsControl} from "../preview-load-modal/results"
import {useEffect, useState} from "react"
import {FormatSelect} from "../format-select"
import {LoadFormat} from "@brimdata/zed-js"

export function DataFile(props: {path: string}) {
  const {path} = props
  const [format, setFormat] = useState<LoadFormat>(null)
  const ctl = useResultsControl([path], format)

  useEffect(() => {
    ctl.queryAll("* | head 50")
  }, [path, format])

  return (
    <>
      <div className="panels">
        <section className="flow border-b box">
          <h1>{basename(path)}</h1>
          <p>{path}</p>
          <IconButton iconName="pool" label="Load" display="icon-label" />
          <FormatSelect
            value={format}
            onChange={(e) => setFormat(e.currentTarget.value)}
            className="w-fit"
          />
        </section>
        <Results {...ctl} title="preview" className="principle" />
      </div>
    </>
  )
}
