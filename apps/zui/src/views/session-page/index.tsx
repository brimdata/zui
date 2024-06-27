import {useLayoutEffect} from "react"
import {Editor} from "./editor"
import {Footer} from "./footer"
import {Grid} from "./grid"
import {Pins} from "./pins"
import {Results} from "./results"
import {Toolbar} from "./toolbar"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import {SessionPageHandler} from "./handler"

export function SessionPage() {
  const locationKey = useSelector(Current.getLocation).key
  const tabKey = useSelector(Tab.getLastLocationKey)
  const handler = new SessionPageHandler({locationKey})

  useLayoutEffect(() => {
    // When you switch tabs, the location key changes, but you don't want to reload
    const tabHasLoaded = tabKey === locationKey
    if (!tabHasLoaded) handler.load()
  }, [locationKey, tabKey])

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
