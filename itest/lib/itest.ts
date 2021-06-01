import startApp from "./appStep/api/startApp"
import BrimDriver from "./brim-driver"
import BrimSelectors from "./brim-selectors"
import newAppInstance from "./newAppInstance"

export default function itest(name): [BrimDriver, BrimSelectors] {
  let app
  let testIdx = 0
  let brim = new BrimDriver(app)
  let $ = new BrimSelectors()

  beforeAll(async () => {
    app = await newAppInstance(name, ++testIdx)
    brim.app = app
    await startApp(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) await app.stop()
  })

  return [brim, $]
}
