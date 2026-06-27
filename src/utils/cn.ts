import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely, combining clsx and tailwind-merge logic.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
