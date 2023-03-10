// @deno-types="https://cdn.jsdelivr.net/npm/dayjs/index.d.ts"
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs/+esm"
import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { Range } from "https://cdn.skypack.dev/immutable?dts"

function dateRange(beginDate: Date, endDate: Date): Array<Date> {
    const d1 = dayjs(beginDate)
    const d2 = dayjs(endDate)

    if (d2.isBefore(d1)) {
        return []
    }

    return Range()
        .map(i => d1.add(i, 'days'))
        .takeWhile(day => day.isBefore(d2))
        .map(day => day.toDate())
        .concat(endDate)
        .toArray()
}

Deno.test("Basic", () => {
    const begin = new Date('2022-08-01');
    const end = new Date('2022-08-05');
    const expected = [
        new Date('2022-08-01'),
        new Date('2022-08-02'),
        new Date('2022-08-03'),
        new Date('2022-08-04'),
        new Date('2022-08-05')
    ];
    assertEquals(dateRange(begin, end), expected);
});

Deno.test("Across a month", () => {
    const begin = new Date('2023-02-26');
    const end = new Date('2023-03-02');
    const expected = [
        new Date('2023-02-26'),
        new Date('2023-02-27'),
        new Date('2023-02-28'),
        new Date('2023-03-01'),
        new Date('2023-03-02')
    ];
    assertEquals(dateRange(begin, end), expected);
})

Deno.test("endDate comes before beginDate", () => {
    const begin = new Date('2023-03-05');
    const end = new Date('2023-03-02');
    const expected: Date[] = [];
    assertEquals(dateRange(begin, end), expected);
})
