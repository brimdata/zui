module.exports = ({assert, zealot}) => {
  const client = new zealot.Client("http://localhost:9000")

  it("creates an instance", () => {
    assert.equal(typeof client.query, "function")
    assert.equal(typeof client.version, "function")
  })

  it("requests the lake version", async () => {
    const r = await client.version()
    assert.equal(typeof r.version, "string")
  })

  it("queries from pr pools", async () => {
    const pools = await client
      .query("from prs | over this | count()")
      .then((r) => r.js())

    assert.deepEqual(pools, [30])
  })
}
