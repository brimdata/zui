/**
 * A safe way to call a function that does nothing if
 * the function is undefined.
 */
export function call<Fn extends (...a: any[]) => any>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  if (fn) fn(...args)
}
