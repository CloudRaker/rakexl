import { expect, test } from "vitest";
import jexl from "../src";

test("time", () => {
  expect(
    jexl.evalSync("(now()|toMillis / 1000)|ceil == (millis() / 1000)|ceil")
  ).toBe(true);
  expect(
    jexl.evalSync(
      "(((millis() / 1000) | ceil) * 1000) | toDateTime == ((now()|toMillis / 1000) | ceil * 1000) | toDateTime"
    )
  ).toBe(true);
  expect(
    jexl.evalSync(
      "(((millis() / 1000) | ceil) * 1000) | toDateTime | dateTimeAdd('second',5)"
    )
  ).toBe(
    jexl.evalSync("(((now()|toMillis / 1000) + 5) | ceil * 1000) | toDateTime")
  );
  expect(
    jexl.evalSync(
      "(((millis() / 1000) | ceil) * 1000) | toDateTime | dateTimeAdd('second',5) == (((now()|toMillis / 1000) + 5) | ceil * 1000) | toDateTime"
    )
  ).toBe(true);
  expect(
    jexl.evalSync(
      "'02-22-24 00:00:00'|toDateTime('MM-dd-yy HH:mm:ss') == '2024-02-22T00:00:00Z'|toDateTime"
    )
  ).toBe(true);
  expect(
    jexl.evalSync("'02-22-24 00:00:00'|toDateTime('MM-dd-yy HH:mm:ss')")
  ).toBe(jexl.evalSync("'2024-02-22T00:00:00.0000000+00:00'|toDateTime"));
  expect(
    jexl.evalSync("'2024-02-22T00:00:00.000000Z'|dateTimeFormat('dd.MM.yyyy')")
  ).toBe("22.02.2024");
  expect(jexl.evalSync('1740445200000|dateTimeFormat("yyyyMMdd-HHmmss")')).toBe(
    "20250225-010000"
  );
});

test("convertTimeZone: IANA and Windows timezones", () => {
  expect(
    jexl.evalSync(
      "'2025-11-26T12:00:00Z'|convertTimeZone('Pacific Standard Time')"
    )
  ).toBe("2025-11-26T04:00:00.0000000-08:00");
  expect(
    jexl.evalSync(
      "'2025-06-26T12:00:00Z'|convertTimeZone('Pacific Standard Time')"
    )
  ).toBe("2025-06-26T05:00:00.0000000-07:00");
  expect(
    jexl.evalSync("'2025-06-26T12:00:00Z'|convertTimeZone('Europe/Amsterdam')")
  ).toBe("2025-06-26T14:00:00.0000000+02:00");
  expect(jexl.evalSync("'2025-11-26T12:00:00Z'|convertTimeZone('UTC')")).toBe(
    "2025-11-26T12:00:00.0000000+00:00"
  );
});

test("convertTimeZone: fixed offsets", () => {
  // UTC to UTC (no offset change)
  expect(jexl.evalSync("'2025-11-26T12:00:00Z'|convertTimeZone('UTC')")).toBe(
    "2025-11-26T12:00:00.0000000+00:00"
  );
  // UTC to fixed offset +02:00
  expect(
    jexl.evalSync("'2025-11-26T12:00:00Z'|convertTimeZone('+02:00')")
  ).toBe("2025-11-26T14:00:00.0000000+02:00");
  // UTC to fixed offset -08:00
  expect(
    jexl.evalSync("'2025-06-26T12:00:00Z'|convertTimeZone('-08:00')")
  ).toBe("2025-06-26T04:00:00.0000000-08:00");
  // UTC to fixed offset -08:00 (winter)
  expect(
    jexl.evalSync("'2025-12-26T12:00:00Z'|convertTimeZone('-08:00')")
  ).toBe("2025-12-26T04:00:00.0000000-08:00");
});

test("localTimeToIsoWithOffset", () => {
  expect(
    jexl.evalSync(
      "'2025-06-26 14:00:00'|localTimeToIsoWithOffset('Europe/Amsterdam')"
    )
  ).toBe("2025-06-26T14:00:00.0000000+02:00");
});

test("formatDate: date-fns format tokens", () => {
  // Year-month
  expect(
    jexl.evalSync("'2024-01-15T00:00:00.000Z'|formatDate('yyyy-MM')")
  ).toBe("2024-01");

  // Full date with slashes
  expect(
    jexl.evalSync("'2024-03-25T00:00:00.000Z'|formatDate('dd/MM/yyyy')")
  ).toBe("25/03/2024");

  // Standalone long month name (LLLL)
  expect(
    jexl.evalSync("'2024-06-15T00:00:00.000Z'|formatDate('LLLL')")
  ).toBe("June");

  // Standalone short month name (LLL)
  expect(
    jexl.evalSync("'2024-06-15T00:00:00.000Z'|formatDate('LLL')")
  ).toBe("Jun");

  // Year only
  expect(
    jexl.evalSync("'2024-06-15T00:00:00.000Z'|formatDate('yyyy')")
  ).toBe("2024");

  // Compact date-time
  expect(
    jexl.evalSync("'2024-02-14T08:30:00.000Z'|formatDate('yyyyMMdd-HHmmss')")
  ).toBe("20240214-083000");

  // Numeric input (millis)
  expect(
    jexl.evalSync("1703505000000|formatDate('yyyy-MM-dd')")
  ).toBe("2023-12-25");

  // Function form
  expect(
    jexl.evalSync("formatDate('2024-01-15T00:00:00.000Z', 'yyyy-MM')")
  ).toBe("2024-01");

  // $-prefixed function form
  expect(
    jexl.evalSync("$formatDate('2024-01-15T00:00:00.000Z', 'yyyy-MM')")
  ).toBe("2024-01");

  // Invalid input returns null
  expect(
    jexl.evalSync("true|formatDate('yyyy-MM')")
  ).toBeNull();

  // Day of week
  expect(
    jexl.evalSync("'2024-03-25T00:00:00.000Z'|formatDate('EEEE')")
  ).toBe("Monday");

  // Short day of week
  expect(
    jexl.evalSync("'2024-03-25T00:00:00.000Z'|formatDate('EEE')")
  ).toBe("Mon");

  // ISO week number
  expect(
    jexl.evalSync("'2024-01-15T00:00:00.000Z'|formatDate('II')")
  ).toBe("03");
});
