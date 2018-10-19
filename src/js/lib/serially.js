export default (run, abort) => {
  let prev
  return (...args) => {
    if (prev) abort(prev)

    const current = run(...args)
    prev = current
    return current
  }
}
