import Histories from "./histories"

test("tab histories create / remove", () => {
  const histories = new Histories()
  histories.create("tab-id-1")
  expect(histories.count()).toBe(1)

  histories.delete("tab-id-1")
  expect(histories.count()).toBe(0)
})

test("tab histories get", () => {
  const histories = new Histories()
  histories.create("tab-id-1")

  const tabHistory = histories.get("tab-id-1")
  tabHistory.push("/home")

  expect(tabHistory.entries.map((e) => e.pathname)).toEqual(["/", "/home"])
})

test("create with empty entries defaults to root path", () => {
  const histories = new Histories()
  histories.create("tab-id-1", [], -1)

  const tabHistory = histories.get("tab-id-1")
  expect(tabHistory.location.pathname).toEqual("/")
})

test("serialize", () => {
  const histories = new Histories()
  histories.create("tab-id-1")
  histories.create("tab-id-2")
  histories.get("tab-id-1").push("/home")
  histories.get("tab-id-2").push("/run")

  expect(histories.serialize()).toEqual([
    {
      id: "tab-id-1",
      entries: [
        {
          hash: "",
          key: expect.any(String),
          pathname: "/",
          search: "",
          state: undefined,
        },
        {
          hash: "",
          key: expect.any(String),
          pathname: "/home",
          search: "",
          state: undefined,
        },
      ],
      index: 1,
    },
    {
      id: "tab-id-2",
      entries: [
        {
          hash: "",
          key: expect.any(String),
          pathname: "/",
          search: "",
          state: undefined,
        },
        {
          hash: "",
          key: expect.any(String),
          pathname: "/run",
          search: "",
          state: undefined,
        },
      ],
      index: 1,
    },
  ])
})
