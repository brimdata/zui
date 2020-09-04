

type PromiseFunc = () => Promise<any>;

export function retry(f: PromiseFunc, attempts: number = 100, delay: number = 100) {
  return new Promise<any>((resolve, reject) => {
    f().then(ret => resolve(ret)).catch(err => {
      setTimeout(() => {
        if (attempts === 1) {
          reject(err);
        } else {
          retry(f, attempts - 1, delay).then(ret => resolve(ret)).catch(err => reject(err));
        }
      }, delay);
    });
  });
}

export const retryUntil = (f: PromiseFunc, cond_f: (arg0: any) => boolean, attempts: number = 15, delay: number = 1000) => // Retry f until a condition is met. cond_f receives the value from f after
// it is resolved and is responsible for examining and returning a boolean to
// determine if the condition is satisfied.
retry(() => new Promise((resolve, reject) => {
  f().then(val => {
    if (cond_f(val)) {
      resolve(val);
    } else {
      reject(new Error(`retryUntil condition failure: ${val}`));
    }
  }).catch(err => {
    reject(`retryUntil promise failure: ${err}`);
  });
}), attempts, delay);