import {useParams} from "react-router"
import {DataFile} from "./data-file"
import {ext} from "src/util/ext"
import {MarkdownFile} from "./markdown-file"

export function FilePage() {
  console.log("FilePage")
  const params = useParams<any>()
  const path = decodeURIComponent(params.path)

  if (ext(path).toLowerCase() === "md") {
    return <MarkdownFile path={path} />
  } else {
    return <DataFile path={path} />
  }
}
