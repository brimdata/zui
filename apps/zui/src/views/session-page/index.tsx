import {NamedQuery} from "src/models/named-query"
import {Editor} from "./editor"
import {Footer} from "./footer"
import {Grid} from "./grid"
import {Pins} from "./pins"
import {Results} from "./results"
import {Toolbar} from "./toolbar"
import {useStateObject} from "src/core/state-object"
import {SessionPageHandler} from "./handler"
import {useLayoutEffect} from "react"
import {loadRoute} from "./loader"

export type Props = {
  locationKey: string
}

export type State = {
  namedQuery: NamedQuery | null
  isModified: boolean
}

export function SessionPage(props: Props) {
  const state = useStateObject<State>({namedQuery: null, isModified: false})
  const page = new SessionPageHandler(props, state)

  useLayoutEffect(() => {
    page.load()
    loadRoute(props.locationKey)
  }, [props.locationKey])

  return (
    <Grid>
      <Toolbar {...state} />
      <Pins />
      <Editor />
      <Results />
      <Footer />
    </Grid>
  )
}
