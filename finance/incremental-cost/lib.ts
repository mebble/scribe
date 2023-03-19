// @deno-types="https://cdn.jsdelivr.net/npm/dayjs/index.d.ts"
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs/+esm"
import { Range, Seq } from "https://cdn.skypack.dev/immutable?dts"
import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";

export function dateRange(beginDate: Date, endDate: Date): Array<Date> {
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

Deno.test("generate dates between two dates", () => {
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

Deno.test("across a month", () => {
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

type Cost = number;
type InstanceCosts<T> = [Cost, T][]
type Differ<T> = (next: T, prev: T) => number

export function marginalCosts<InstantType>(
    instances: InstanceCosts<InstantType>,
    diff: Differ<InstantType>
): number[] {
    const seq = Seq(instances)
    const rest = seq.rest()
    return seq.zip(rest)
        .map(([prev, next]) => {
            const [cost, prevInstance] = prev;
            const [, nextInstance] = next;
            return [cost, diff(nextInstance, prevInstance)] as [number, number]
        })
        .filter(([, diff]) => diff !== 0)
        .map(([cost, diff]) => cost / diff)
        .toArray()
}

Deno.test("marginal costs from list of instance costs", () => {
    const instances: InstanceCosts<number> = [
        [20, 0],   // bigger: 20 takes me 0 to 80 (ie 80)
        [50, 80],  // smaller: 50 takes me 80 to 100 (ie 20)
        [12, 100], // same: 12 takes me 100 to 112 (ie 12)
        [10, 112],
    ]
    const expected: number[] = [
        0.25,
        2.5,
        1
    ];

    assertEquals(marginalCosts(instances, (x, y) => x - y), expected);
})
