import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Extract a human-readable message from an unknown thrown value. */
export function errorMessage(err: unknown, fallback = "Diçka shkoi keq"): string {
  return err instanceof Error ? err.message : fallback
}
