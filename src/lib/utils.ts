import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const clockFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

const tzFormatter = new Intl.DateTimeFormat(undefined, {
  timeZoneName: "short",
});

export function formatClockTime(iso: string): string {
  return clockFormatter.format(new Date(iso));
}

export function getTimezoneAbbr(): string {
  const parts = tzFormatter.formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

export function formatTimeRange(startIso: string, endIso: string): string {
  const start = formatClockTime(startIso);
  const end = formatClockTime(endIso);
  const tz = getTimezoneAbbr();
  return `${start} – ${end} ${tz}`.trim();
}
