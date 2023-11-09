import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RemoveUndefined<T extends object> = {
  [K in keyof T as Exclude<T[K], undefined> extends never ? never : K]: Exclude<T[K], undefined>;
};
export function stripOptionalValues<T extends object>(obj: T): RemoveUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as RemoveUndefined<T>;
}
