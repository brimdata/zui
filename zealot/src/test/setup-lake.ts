import {createZealot} from "../zealot"
import {Client} from "../client"
import {ZedLake} from "./lake"

class TestLake {
  // @ts-ignore
  lake: ZedLake
  // @ts-ignore
  client: Client
  // @ts-ignore
  oldClient: any

  assign(
    lake: TestLake["lake"],
    client: TestLake["client"],
    oldClient: TestLake["oldClient"]
  ) {
    this.lake = lake
    this.client = client
    this.oldClient = oldClient
  }
}

export default function setupLake() {
  const setup = new TestLake()
  beforeAll(async () => {
    const lake = new ZedLake(9888)
    try {
      const client = await lake.start()
      const oldClient = createZealot("localhost:9888")
      setup.assign(lake, client, oldClient)
    } catch (e) {
      await lake.stop()
      throw e
    }
  })
  afterAll(() => {
    setup.lake && setup.lake.stop()
  })
  return setup
}
