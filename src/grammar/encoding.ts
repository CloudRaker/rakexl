/**
 * Encodes a string to Base64.
 *
 * @example
 * base64Encode("hello") // "aGVsbG8="
 * "hello world"|base64Encode // "aGVsbG8gd29ybGQ="
 * base64Encode("test") // "dGVzdA=="
 * @group Encoding
 *
 * @param input The input string to encode.
 * @returns The Base64 encoded string, or empty string if input is not a string or encoding fails.
 */
export const base64Encode = (input: unknown) => {
  if (typeof input === "string") {
    try {
      encodeURIComponent(input);
      const bytes = new TextEncoder().encode(input);
      const binString = String.fromCodePoint(...bytes);
      return btoa(binString);
    } catch (error) {
      return "";
    }
  }
  return "";
};

/**
 * Decodes a Base64 encoded string.
 *
 * @example
 * base64Decode("aGVsbG8=") // "hello"
 * "aGVsbG8gd29ybGQ="|base64Decode // "hello world"
 * base64Decode("dGVzdA==") // "test"
 * @group Encoding
 *
 * @param input The Base64 encoded string to decode.
 * @returns The decoded string, or empty string if input is not a string.
 */
export const base64Decode = (input: unknown) => {
  if (typeof input === "string") {
    const binString = atob(input);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
  }
  return "";
};

/**
 * Encodes a string or object to URI component format.
 *
 * @example
 * formUrlEncoded("hello world") // "hello%20world"
 * formUrlEncoded({name: "John", age: 30}) // "name=John&age=30"
 * "hello & world"|formUrlEncoded // "hello%20%26%20world"
 * @group Encoding
 *
 * @param input The input string or object to encode.
 * @returns The URL encoded string, or empty string if input is not a string or object.
 */
export const formUrlEncoded = (input: unknown) => {
  if (typeof input === "string") {
    return encodeURIComponent(input);
  } else if (typeof input === "object") {
    return Object.keys(input)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(input[key])}`
      )
      .join("&");
  }
  return "";
};

const CRC8_POLY = 0x07;

function crc8(str: string): number {
  const bytes = new TextEncoder().encode(str);
  let crc = 0x00;
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x80 ? (crc << 1) ^ CRC8_POLY : crc << 1;
      crc &= 0xff;
    }
  }
  return crc;
}

/**
 * Computes a 1-character CRC-8 checksum of a string (base-36, uppercase).
 *
 * @example
 * checksum1("DOC-001") // "H"
 * "CASE-2026-000184"|checksum1 // "F"
 * @group Encoding
 *
 * @param input The input string to checksum.
 * @returns A single uppercase alphanumeric character, or undefined if input is not a string.
 */
export const checksum1 = (input: unknown): string | undefined => {
  if (typeof input !== "string") return undefined;
  const v = crc8(input) % 36;
  return v.toString(36).toUpperCase();
};

/**
 * Computes a 2-character CRC-8 checksum of a string (base-36, uppercase, zero-padded).
 *
 * @example
 * checksum2("DOC-001") // "2T"
 * "CASE-2026-000184"|checksum2 // "0F"
 * @group Encoding
 *
 * @param input The input string to checksum.
 * @returns A 2-character uppercase alphanumeric string, or undefined if input is not a string.
 */
export const checksum2 = (input: unknown): string | undefined => {
  if (typeof input !== "string") return undefined;
  const v = crc8(input);
  return v.toString(36).toUpperCase().padStart(2, "0");
};

/**
 * Appends a CRC-8 checksum to a string.
 *
 * @example
 * withChecksum("DOC-001") // "DOC-001-2T"
 * "CASE-2026-000184"|withChecksum // "CASE-2026-000184-0F"
 * withChecksum("DOC-001", 1) // "DOC-001-H"
 * "DOC-001"|withChecksum(2, ".") // "DOC-001.2T"
 * @group Encoding
 *
 * @param input The input string to append a checksum to.
 * @param chars Number of checksum characters: 1 or 2 (default 2).
 * @param sep Separator between the input and checksum (default "-").
 * @returns The input string with appended checksum, or undefined if input is not a string.
 */
export const withChecksum = (
  input: unknown,
  chars: unknown = 2,
  sep: unknown = "-"
): string | undefined => {
  if (typeof input !== "string") return undefined;
  const c = typeof chars === "number" ? chars : 2;
  const s = typeof sep === "string" ? sep : "-";
  const cs = c === 1 ? checksum1(input) : checksum2(input);
  return `${input}${s}${cs}`;
};

/**
 * Verifies the CRC-8 checksum appended to a string.
 *
 * @example
 * verifyChecksum("DOC-001-2T") // true
 * "CASE-2026-000184-0F"|verifyChecksum // true
 * verifyChecksum("DOC-001-XX") // false
 * "INV-99"|verifyChecksum(1) // false
 * @group Encoding
 *
 * @param input The string with appended checksum to verify.
 * @param chars Number of checksum characters: 1 or 2 (default 2).
 * @param sep Separator between the input and checksum (default "-").
 * @returns True if the checksum is valid, false otherwise.
 */
export const verifyChecksum = (
  input: unknown,
  chars: unknown = 2,
  sep: unknown = "-"
): boolean => {
  if (typeof input !== "string") return false;
  const c = typeof chars === "number" ? chars : 2;
  const s = typeof sep === "string" ? sep : "-";

  const idx = input.lastIndexOf(s);
  if (idx <= 0) return false;

  const id = input.slice(0, idx);
  const cs = input.slice(idx + s.length).toUpperCase();

  if (c === 1) {
    if (cs.length !== 1 || !/^[0-9A-Z]$/.test(cs)) return false;
    return cs === checksum1(id);
  } else {
    if (cs.length !== 2 || !/^[0-9A-Z]{2}$/.test(cs)) return false;
    return cs === checksum2(id);
  }
};
