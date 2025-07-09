import { feFrameworks } from "@/content/fe-frameworks";
import type { FeFrameworkKey, Framework } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFrameworkFromId = (id: FeFrameworkKey): Framework =>
  feFrameworks.find((framework) => framework.id === id)!;
