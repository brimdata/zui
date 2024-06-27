function wrapper(goFunc) {
  return (...args) => {
    const result = goFunc.apply(undefined, args);
    if (result.error instanceof Error) {
      throw result.error;
    }
    return result.result;
  };
}

globalThis.__go_wasm__ = {
  __wrapper__: wrapper,
  __ready__: false,
};
