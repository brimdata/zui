import getTestState from "src/js/state/migrations/utils/getTestState"
import migrate from "./202005261448_setInvestigationSpaceToNameAndId"

test("migrating 202005261448_setInvestigationSpaceToNameAndId", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  expect(next.globalState.investigation).toEqual([
    {
      ts: {ns: 423000000, sec: 1589586666},
      search: {
        pins: [],
        program: "",
        spanArgs: [
          {ns: 943615000, sec: 1425565512},
          {ns: 733000000, sec: 1428917684},
        ],
        spaceName: "corelight.pcap.brim",
        spaceId: "corelight.pcap.brim",
      },
    },
    {
      ts: {ns: 254000000, sec: 1589586682},
      search: {
        pins: [],
        program: "",
        spanArgs: [
          {ns: 47800000, sec: 1425567042},
          {ns: 141000000, sec: 1428917565},
        ],
        spaceName: "pcaps.brim",
        spaceId: "pcaps.brim",
      },
    },
  ])
})
