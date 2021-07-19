import {render} from "test/unit/helpers"
import {setupBrim} from "test/unit/helpers/setup-brim"
import Preferences from "./Preferences"

const brim = setupBrim({page: "search"})

test("render preferences", async () => {
  render(<Preferences />, {store: brim.store})
})
