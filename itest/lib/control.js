/* @flow */

export const retry = (f, attempts: number = 100, delay: number = 100) => {
  return new Promise((resolve, reject) => {
    f()
      .then((ret) => resolve(ret))
      .catch((err) => {
        setTimeout(() => {
          if (attempts === 1) {
            reject(err)
          } else {
            retry(f, attempts - 1, delay)
              .then((ret) => resolve(ret))
              .catch((err) => reject(err))
          }
        }, delay)
      })
  })
}

export const retryUntil = (
  f,
  cond_f,
  attempts: number = 5,
  delay: number = 1000
) =>
  // Retry f until cond_f is true. Return results from f.
  //
  // f: function that returns a promise
  // cond_f: function that expects f's resolved value and returns a Boolean.
  // If cond_f returns false, then f is retried. This attempts every delay ms
  // for attempts before rejecting.
  retry(
    () =>
      new Promise((resolve, reject) => {
        f()
          .then((val) => {
            if (cond_f(val)) {
              resolve(val)
            } else {
              reject(new Error(`retryUntil condition failure: ${val}`))
            }
          })
          .catch((err) => {
            reject(`retryUntil promise failure: ${err}`)
          })
      }),
    attempts,
    delay
  )
