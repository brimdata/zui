/* @flow */
import lib from "./"

function addOne(n) {
  return n + 1
}

async function asyncAddOne(n) {
  return new Promise((r) => r(n + 1))
}

async function asyncMinusOne(n) {
  return new Promise((r) => r(n - 1))
}

function throwErr() {
  throw new Error("Bam")
}

function throwUndoErr() {
  throw new Error("Undo Bam")
}

test("failure", async () => {
  let undo = jest.fn()

  try {
    await lib.transaction([
      {do: () => 1, undo},
      {do: addOne, undo},
      {do: throwErr, undo}
    ])
  } catch (e) {
    expect(e.message).toBe(
      "Transaction failed at step 3 of 3 (Undos succeeded)\nCause: Bam"
    )
    expect(e.cause.message).toBe("Bam")
  }
  expect(undo).toHaveBeenCalledTimes(2)
})

test("if undo throws", async () => {
  let undo = jest.fn()

  try {
    await lib.transaction([
      {do: () => 1, undo},
      {do: addOne, undo: throwUndoErr},
      {do: throwErr, undo}
    ])
  } catch (e) {
    expect(e.message).toBe(
      "Transaction failed at step 3 of 3 (Undos failed at step 2)\nCause: Bam"
    )
    expect(e.undoErrors.map((e) => e.message)).toEqual([
      "Undo 2 Failed: Undo Bam"
    ])
  }
  expect(undo).toHaveBeenCalledTimes(1)
})

test("async work", async () => {
  let result = await lib.transaction([
    {do: () => 1, undo: () => {}},
    {do: asyncAddOne, undo: () => {}}
  ])

  expect(result).toBe(2)
})

test("async undo", async () => {
  let n = 1
  try {
    await lib.transaction([
      {do: () => (n = n + 1), undo: () => (n = n - 1)},
      {do: () => (n = n + 1), undo: async () => (n = await asyncMinusOne(n))},
      {do: throwErr, undo: () => {}}
    ])
  } catch {
    expect(n).toBe(1)
  }
})

test("returning undefined passes through ctx", async () => {
  let result = await lib.transaction([
    {do: () => 1, undo: () => {}},
    {do: () => {}, undo: () => {}},
    {do: () => {}, undo: () => {}},
    {do: () => {}, undo: () => {}},
    {do: () => {}, undo: () => {}}
  ])

  expect(result).toBe(1)
})
