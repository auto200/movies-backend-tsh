export function sample<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;

  return arr[Math.floor(Math.random() * arr.length)];
}

export type Sampler = typeof sample;

export function isNumberInTolerance(number: number, middlePoint: number, tolerance: number) {
  return Math.abs(middlePoint - number) <= tolerance ? true : false;
}

export function toArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}

export async function findAsync<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>
): Promise<T | undefined> {
  for (const t of array) {
    if (await predicate(t)) {
      return t;
    }
  }

  return undefined;
}
