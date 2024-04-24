import {basename} from "path"
import {useParams} from "react-router"
import {IconButton} from "src/components/icon-button"
import {Results, useResultsControl} from "../preview-load-modal/results"
import {useEffect} from "react"

export function FilePage() {
  const params = useParams<any>()
  const path = decodeURIComponent(params.path)
  const ctl = useResultsControl([path], "auto")

  useEffect(() => {
    ctl.queryAll("* | head 50")
  }, [path])

  return (
    <>
      <div className="panels">
        <section className="flow border-b box">
          <h1>{basename(path)}</h1>
          <p>{path}</p>
          <IconButton iconName="pool" label="Load" display="icon-label" />
        </section>
        <Results {...ctl} title="preview" className="principle" />
      </div>
    </>
  )
}
