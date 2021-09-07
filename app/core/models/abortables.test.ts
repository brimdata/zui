import {Abortables, Abortable} from "./abortables"

describe("add get remove", () => {
  function setup() {
    return {instance: new Abortables()}
  }

  test("add with no id", () => {
    const {instance} = setup()
    const id = instance.add({abort: jest.fn()})
    const abortable = instance.get(id)

    expect(abortable).toEqual({id, abort: expect.any(Function)})
  })

  test("remove", () => {
    const {instance} = setup()
    const id = instance.add({abort: jest.fn()})

    instance.remove(id)

    expect(instance.all()).toEqual([])
  })

  test("remove by tab", () => {
    const {instance} = setup()
    instance.add({abort: jest.fn(), tab: "a"})
    instance.add({abort: jest.fn(), tab: "a"})
    instance.add({abort: jest.fn(), tab: "b"})

    instance.remove({tab: "a"})

    expect(instance.all()).toHaveLength(1)
  })
})

describe("filter and abort", () => {
  function ids(a: Abortable[]) {
    return a.map((a) => a.id)
  }
  function setup() {
    const instance = new Abortables()
    const a1 = {id: "1", tab: "a", tag: "main", abort: jest.fn()}
    const a2 = {id: "2", tab: "b", tag: "main", abort: jest.fn()}
    const a3 = {id: "3", tab: "a", tag: "detail", abort: jest.fn()}
    instance.add(a1)
    instance.add(a2)
    instance.add(a3)
    return {instance, a1, a2, a3}
  }

  test("filter by area", () => {
    const {instance} = setup()

    const result = instance.filter({tag: "main"})

    expect(ids(result)).toEqual(["1", "2"])
  })

  test("filter by tab", () => {
    const {instance} = setup()

    const result = instance.filter({tab: "a"})

    expect(ids(result)).toEqual(["1", "3"])
  })

  test("filter by tab and area", () => {
    const {instance} = setup()

    const result = instance.filter({tab: "a", tag: "detail"})

    expect(ids(result)).toEqual(["3"])
  })

  test("abort", () => {
    const {instance, a1, a2, a3} = setup()

    instance.abort()

    expect(a1.abort).toHaveBeenCalled()
    expect(a2.abort).toHaveBeenCalled()
    expect(a3.abort).toHaveBeenCalled()
  })

  test("abort by tab", () => {
    const {instance, a1, a2, a3} = setup()

    instance.abort({tab: "b"})

    expect(a1.abort).not.toHaveBeenCalled()
    expect(a2.abort).toHaveBeenCalled()
    expect(a3.abort).not.toHaveBeenCalled()
  })
})
