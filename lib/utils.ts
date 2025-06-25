import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function buildGoogleFontsUrl(font: string) {
    const family = font.replace(/ /g, "+") + ":wght@400;700";
    return `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
}
