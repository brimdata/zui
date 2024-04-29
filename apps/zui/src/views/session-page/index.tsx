import {NamedQuery} from "src/models/named-query"
import {Editor} from "./editor"
import {Footer} from "./footer"
import {Grid} from "./grid"
import {Pins} from "./pins"
import {Results} from "./results"
import {Toolbar} from "./toolbar"

export type SessionPageProps = {
  namedQuery?: NamedQuery
  isModified: boolean
}

export function SessionPage(props: SessionPageProps) {
  return (
    <Grid>
      <Toolbar {...props} />
      <Pins />
      <Editor />
      <Results />
      <Footer />
    </Grid>
  )
}
