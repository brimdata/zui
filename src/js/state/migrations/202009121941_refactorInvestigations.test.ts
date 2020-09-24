import getTestState from "../../test/helpers/getTestState"
import migrate from "./202009121941_refactorInvestigations"

test("migrating 202009121941_refactorInvestigations", () => {
  const {data} = getTestState("v0.17.0")

  const next = migrate(data)
  const space1 = "sp_1hWwRQKtTnWlkr7w57k91Ofw2Sr"
  const space2 = "sp_1hWwT27GJg9kHqgrVanqvvO5Ke5"
  const space3 = "sp_1hWwTowuLDqnmIE4u5SrYIPq86k"

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    const investigations = state.investigation["localhost:9867"]

    expect(investigations[space1]).toHaveLength(1)
    expect(investigations[space2]).toHaveLength(2)
    expect(investigations[space3]).toHaveLength(3)
  }
})
