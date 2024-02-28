export function createWaitForSelector(store) {
  return function waitForSelector(
    select,
    options: {signal?: AbortSignal} = {}
  ) {
    let resolve
    let targetValue

    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      if (select(state) === targetValue) {
        unsubscribe()
        resolve()
      }
    })

    let promise = new Promise((res, reject) => {
      resolve = res
      options.signal?.addEventListener("abort", () => {
        unsubscribe()
        reject(new DOMException("AbortError"))
      })
    })

    return {
      toReturn(value) {
        targetValue = value
        return promise
      },
    }
  }
}
