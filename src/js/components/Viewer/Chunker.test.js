import Chunker from "./Chunker"

test("#visibleChunks height = 1", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 1,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 0

  expect(chunker.visibleChunks(scrollTop)).toEqual([0])
})

test("#visibleChunks height = 50", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 0

  expect(chunker.visibleChunks(scrollTop)).toEqual([0, 1])
})

test("#visibleChunks height = 51", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 51,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 0

  expect(chunker.visibleChunks(scrollTop)).toEqual([0, 1])
})

test("#visibleChunks height = 50, scrollTop = 50", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 50

  expect(chunker.visibleChunks(scrollTop)).toEqual([1, 2])
})

test("#visibleChunks height = 58, scrollTop = 50", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 58,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 50

  expect(chunker.visibleChunks(scrollTop)).toEqual([1, 2])
})

test("#visibleChunks height = 50, scrollTop = 51", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 51

  expect(chunker.visibleChunks(scrollTop)).toEqual([1, 2])
})

test("#visibleChunks height = 50, scrollTop = 9950", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 9950

  expect(chunker.visibleChunks(scrollTop)).toEqual([199])
})

test("#visibleChunks when scrolled past the bottom", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = 9999

  expect(chunker.visibleChunks(scrollTop)).toEqual([199])
})

test("#visibleChunks when scrolled past the beginning", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5
  })
  const scrollTop = -1

  expect(chunker.visibleChunks(scrollTop)).toEqual([0])
})

test("#visibleChunks when in the middle", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 2
  })
  const scrollTop = 444

  expect(chunker.visibleChunks(scrollTop)).toEqual([22, 23, 24])
  expect([
    ...chunker.rows(22),
    ...chunker.rows(23),
    ...chunker.rows(24)
  ]).toEqual([44, 45, 46, 47, 48, 49])
})

test("#visibleChunks always changes together", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5
  })
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2])
  expect(chunker.visibleChunks(1)).toEqual([0, 1, 2])
  expect(chunker.visibleChunks(49)).toEqual([0, 1, 2])
  expect(chunker.visibleChunks(50)).toEqual([1, 2, 3])
  expect(chunker.visibleChunks(51)).toEqual([1, 2, 3])
  expect(chunker.visibleChunks(99)).toEqual([1, 2, 3])
  expect(chunker.visibleChunks(100)).toEqual([2, 3, 4])
  expect(chunker.visibleChunks(101)).toEqual([2, 3, 4])
})

test("#visibleChunks overScan = 2", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5,
    overScan: 2
  })
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2, 3, 4])
})

test("#visibleChunks overScan = 1", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5,
    overScan: 1
  })
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2, 3])
})

test("#visibleChunks overScan = 2 in the middle", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5,
    overScan: 2
  })

  expect(chunker.visibleChunks(525)).toEqual([8, 9, 10, 11, 12, 13, 14])
})

test("#visibleChunks overScan = 2 at the end", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5,
    overScan: 2
  })

  expect(chunker.visibleChunks(9950)).toEqual([197, 198, 199])
})

test("#rows for first chunk", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5
  })

  expect(chunker.rows(0)).toEqual([0, 1, 2, 3, 4])
})
test("#rows for last chunk", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 5
  })

  expect(chunker.rows(199)).toEqual([995, 996, 997, 998, 999])
})
test("#rows for last chunk odd numbers", () => {
  const chunker = new Chunker({
    size: 1000,
    height: 100,
    rowHeight: 10,
    chunkSize: 7
  })
  expect(chunker.rows(141)).toEqual([987, 988, 989, 990, 991, 992, 993])
  expect(chunker.rows(142)).toEqual([994, 995, 996, 997, 998, 999])
})

test("#rows for first chunk size less than chunk size", () => {
  const chunker = new Chunker({
    size: 3,
    height: 100,
    rowHeight: 10,
    chunkSize: 7
  })
  expect(chunker.rows(0)).toEqual([0, 1, 2])
})
