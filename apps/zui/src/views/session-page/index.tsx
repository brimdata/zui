import {Editor} from "./editor"
import {Footer} from "./footer"
import {Grid} from "./grid"
import {Pins} from "./pins"
import {Results} from "./results"
import {Toolbar} from "./toolbar"

export function SessionPage() {
  return (
    <Grid>
      <Toolbar />
      <Pins />
      <Editor />
      <Results />
      <Footer />
    </Grid>
  )
}
