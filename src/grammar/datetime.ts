import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { findIana } from "windows-iana";
import {
  parse as dateParse,
  add as dateAdd,
  format as dateFormat,
} from "date-fns";

/**
 * Returns the current date and time in the ISO 8601 format.
 *
 * @example
 * now() // "2023-12-25T10:30:00.000Z"
 * now() // "2023-12-25T14:45:30.123Z" (different time)
 * @group DateTime
 *
 * @returns The current date and time as an ISO 8601 string.
 */
export const now = () => {
  return new Date().toISOString();
};

/**
 * Returns the current date and time in milliseconds since the Unix epoch.
 *
 * @example
 * millis() // 1703505000000
 * millis() // 1703505123456 (different time)
 * @group DateTime
 *
 * @returns The current timestamp in milliseconds.
 */
export const millis = () => {
  return Date.now();
};

/**
 * Parses the number of milliseconds since the Unix epoch or parses a string (with or without specified format) and returns the date and time in the ISO 8601 format.
 *
 * @example
 * toDateTime(1703505000000) // "2023-12-25T10:30:00.000Z"
 * toDateTime("2023-12-25") // "2023-12-25T00:00:00.000Z"
 * toDateTime("25/12/2023", "dd/MM/yyyy") // "2023-12-25T00:00:00.000Z"
 * toDateTime() // Current date/time (same as now())
 * @group DateTime
 *
 * @param input Optional timestamp in milliseconds or date string.
 * @param format Optional format string for parsing date strings.
 * @returns The date and time as an ISO 8601 string, or undefined if parsing fails.
 */
export const toDateTime = (input?: number | string, format?: string) => {
  if (typeof input === "number") {
    return new Date(input).toISOString();
  }
  if (typeof input === "string") {
    if (format) {
      // Add UTC as timezone if not provided
      const _format =
        format.includes("x") || format.includes("X") ? format : `${format} X`;
      const _input =
        format.includes("x") || format.includes("X") ? input : `${input} Z`;
      return dateParse(_input, _format, new Date()).toISOString();
    }
    return new Date(input).toISOString();
  }
  if (input === undefined) {
    return new Date().toISOString();
  }
  return undefined;
};

/**
 * Converts a date and time to a provided format.
 *
 * @example
 * dateTimeFormat(datetime, format)
 * datetime|dateTimeFormat(format)
 * @group DateTime
 *
 * @param input The input date and time, either as a string or number.
 * @param format The format to convert the date and time to.
 * @returns The date and time in the specified format.
 */
export const dateTimeFormat = (
  input: number | string,
  format: string
): string | null => {
  let dateTime: Date;
  if (typeof input === "string") {
    dateTime = new Date(input);
  } else if (typeof input === "number") {
    dateTime = new Date(input);
  } else {
    return null;
  }

  // Convert to UTC
  const utcDateTime = new Date(
    dateTime.getTime() + dateTime.getTimezoneOffset() * 60000
  );

  // Format the date
  return dateFormat(utcDateTime, format);
};

/**
 * Parses the date and time in the ISO 8601 format and returns the number of milliseconds since the Unix epoch.
 *
 * @example
 * dateTimeToMillis("2023-12-25T10:30:00.000Z") // 1703505000000
 * "2023-01-01T00:00:00.000Z"|dateTimeToMillis // 1672531200000
 * dateTimeToMillis("2023-12-25") // 1703462400000
 * @group DateTime
 *
 * @param input The date and time string to parse.
 * @returns The timestamp in milliseconds since Unix epoch.
 */
export const dateTimeToMillis = (input: string) => {
  return new Date(input).getTime();
};

/**
 * Adds a time range to a date and time in the ISO 8601 format.
 *
 * @example
 * dateTimeAdd("2023-12-25T10:30:00.000Z", "day", 1) // "2023-12-26T10:30:00.000Z"
 * now()|dateTimeAdd("hour", -2) // Two hours ago
 * dateTimeAdd("2023-01-01T00:00:00.000Z", "month", 3) // "2023-04-01T00:00:00.000Z"
 * @group DateTime
 *
 * @param input The input date and time string in ISO 8601 format.
 * @param unit The time unit to add ("day", "hour", "minute", "second", "month", "year", etc.).
 * @param value The amount to add (can be negative to subtract).
 * @returns The new date and time as an ISO 8601 string.
 */
export const dateTimeAdd = (input: string, unit: string, value: number) => {
  // if unit doesn't end with 's' add it
  const _unit = unit.toLowerCase().endsWith("s")
    ? unit.toLowerCase()
    : `${unit.toLowerCase()}s`;
  const returnDate = dateAdd(new Date(input), { [_unit]: value });
  return returnDate.toISOString();
  // dateAdd(new Date(input), { [unit]: value });
};

/**
 * Converts an ISO datetime string to a target timezone, handling daylight savings, and returns an ISO string with the correct offset.
 *
 * @example
 * convertTimeZone('2025-06-26T12:00:00Z', 'Europe/Amsterdam') // 2025-06-26T14:00:00.0000000+02:00
 * '2025-06-26T12:00:00Z'|convertTimeZone('Pacific Standard Time') // '2025-06-26T05:00:00.0000000-07:00'
 * @group DateTime
 *
 * @param input ISO datetime string
 * @param targetTimeZone Target timezone (IANA or Windows ID or fixed offset)
 * @returns ISO datetime string with correct offset
 */
export const convertTimeZone = (
  input: unknown,
  targetTimeZone: unknown
): string | null => {
  if (typeof input !== "string" || typeof targetTimeZone !== "string")
    return null;
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) return null;
    const tzStr = targetTimeZone.trim();

    // Fixed offset: e.g. +02:00 or -08:00
    const offsetMatch = /^([+-])(\d{2}):(\d{2})$/.exec(tzStr);
    if (offsetMatch) {
      const sign = offsetMatch[1] === "+" ? 1 : -1;
      const hours = parseInt(offsetMatch[2], 10);
      const minutes = parseInt(offsetMatch[3], 10);
      const offset = sign * (hours * 60 + minutes);
      const utcMillis = date.getTime();
      const offsetMillis = offset * 60 * 1000;
      const converted = new Date(utcMillis + offsetMillis);
      const pad = (n: number, l = 2) => n.toString().padStart(l, "0");
      const offsetStr = `${offsetMatch[1]}${pad(hours)}:${pad(minutes)}`;
      let iso = converted.toISOString().replace("Z", "");
      const isoMatch = iso.match(/^(.*\.(\d+))/);
      if (isoMatch) {
        const frac = isoMatch[2].padEnd(7, "0").slice(0, 7);
        iso = iso.replace(/\.(\d+)/, `.${frac}`);
      }
      return iso + offsetStr;
    }

    // Windows timezone mapping
    let ianaTz = tzStr;
    if (!tzStr.includes("/") && tzStr.toLowerCase() !== "utc") {
      try {
        const iana = findIana(tzStr);
        if (iana && iana.length > 0 && typeof iana[0] === "string") {
          ianaTz = iana[0];
        }
      } catch {}
    }
    if (tzStr.toLowerCase() === "utc" || tzStr === "Etc/UTC") {
      ianaTz = "UTC";
    }

    // Use formatInTimeZone for robust formatting
    let formatted = formatInTimeZone(
      date,
      ianaTz,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );
    // Patch to 7 digits for fractional seconds
    formatted = formatted.replace(
      /\.(\d{3})/,
      (m, ms) => `.${ms.padEnd(7, "0")}`
    );
    // Patch UTC output to use +00:00 instead of Z
    if (ianaTz === "UTC" && formatted.endsWith("Z")) {
      formatted = formatted.slice(0, -1) + "+00:00";
    }
    return formatted;
  } catch {
    return null;
  }
};

/**
 * Formats a date using date-fns format tokens. Interprets the input as UTC.
 *
 * Common tokens: `yyyy` (year), `MM` (month), `dd` (day), `HH` (24h hour), `mm` (minute), `ss` (second),
 * `LLLL` (standalone month name), `EEEE` (day of week), `II` (ISO week number).
 *
 * @example
 * formatDate("2024-01-15T00:00:00.000Z", "yyyy-MM") // "2024-01"
 * "2024-06-15T00:00:00.000Z"|formatDate("LLLL") // "June"
 * "2024-03-25T00:00:00.000Z"|formatDate("EEEE") // "Monday"
 * 1703505000000|formatDate("yyyy-MM-dd") // "2023-12-25"
 * @group DateTime
 *
 * @param input The input date as an ISO string or milliseconds since epoch.
 * @param format The date-fns format string.
 * @returns The formatted date string, or null if the input is invalid.
 */
export const formatDate = (
  input: number | string,
  format: string
): string | null => {
  let dateTime: Date;
  if (typeof input === "string") {
    dateTime = new Date(input);
  } else if (typeof input === "number") {
    dateTime = new Date(input);
  } else {
    return null;
  }

  if (isNaN(dateTime.getTime())) return null;

  // Convert to UTC so formatting reflects the UTC time, not local
  const utcDateTime = new Date(
    dateTime.getTime() + dateTime.getTimezoneOffset() * 60000
  );

  return dateFormat(utcDateTime, format);
};

/**
 * Converts a local time string in a specified timezone to an ISO datetime string with the correct offset.
 *
 * @example
 * localTimeToIsoWithOffset('2025-06-26 14:00:00', 'Europe/Amsterdam') // '2025-06-26T14:00:00.0000000+02:00'
 * '2025-06-26 05:00:00'|localTimeToIsoWithOffset('Pacific Standard Time') // '2025-06-26T05:00:00.0000000-08:00'
 * @group DateTime
 *
 * @param localTime Local time string
 * @param timeZone Timezone (IANA or Windows ID or fixed offset)
 * @returns ISO datetime string with correct offset
 */
export const localTimeToIsoWithOffset = (
  localTime: string,
  timeZone: string
): string | null => {
  try {
    const utcDate = fromZonedTime(localTime, timeZone);
    let formatted = formatInTimeZone(
      utcDate,
      timeZone,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );
    formatted = formatted.replace(
      /\.(\d{3})/,
      (m, ms) => `.${ms.padEnd(7, "0")}`
    );
    return formatted;
  } catch {
    return null;
  }
};
