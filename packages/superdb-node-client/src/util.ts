export function arrayWrap<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) return value;
  else return [value];
}

export async function waitFor(condition: () => Promise<boolean>) {
  let giveUp = false;
  const id = setTimeout(() => {
    giveUp = true;
  }, 5000);

  while (!giveUp) {
    if (await condition()) break;
    await sleep(50);
  }

  clearTimeout(id);
  return !giveUp;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
