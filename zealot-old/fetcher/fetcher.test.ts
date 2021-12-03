// Uncomment this once this issue is resolved and we can use
// test the upload feature.

// https://github.com/mswjs/interceptors/issues/121

// server.use(
//   rest.get("/", (req, res, ctx) => {
//     res(ctx.status(200), ctx.json({"LogPostResponse", "Hi James"}))
//   })
// )

// test("upload", async () => {
//   const fetcher = createFetcher("localhost:9988")
//   const file = new File(["x".repeat(1 * 1024 * 1024)], "x-file")
//   const fd = new FormData()
//   fd.append("file", file)

//   const upload = await fetcher.upload({
//     path: "/",
//     method: "POST",
//     body: fd
//   })
//   expect(await upload.array()).toEqual([{LogPostResponse: "Hi James"}])
// })
test("to do", () => {})
