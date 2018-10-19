import serially from "./serially"

test("runs a function only one time", done => {
  let values = []

  const run = num => setTimeout(() => values.push(num))
  const abort = timeoutId => clearTimeout(timeoutId)

  const request = serially(run, abort)
  request(1)
  request(2)
  request(3)

  setTimeout(() => {
    expect(values).toEqual([3])
    done()
  })
})
