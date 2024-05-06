import {useParams} from "react-router"
import {ext} from "src/util/ext"
import {MarkdownFilePage} from "../markdown-file-page"
import {DataFilePage} from "../data-file-page"

export function FilePage() {
  const params = useParams<any>()
  const path = decodeURIComponent(params.path)

  if (ext(path).toLowerCase() === "md") {
    return <MarkdownFilePage path={path} />
  } else {
    return <DataFilePage path={path} />
  }
}
