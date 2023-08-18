export function sample<T>(arr: Array<T>): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }

  return arr[Math.floor(Math.random() * arr.length)];
}

export type Sampler = typeof sample;
