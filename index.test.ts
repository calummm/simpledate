import { SimpleDate } from './index';
import { describe, test, expect, it } from 'vitest';

describe('SimpleDate', () => {
  const todayDate = new Date();
  const todayIso = `${todayDate.getFullYear()}-${String(
    todayDate.getMonth() + 1
  ).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  test.each`
    input                           | expected
    ${'2023-01-02'}                 | ${'2023-01-02'}
    ${'2023-01-02T00:00:00.000Z'}   | ${'2023-01-02'}
    ${'20230102'}                   | ${'2023-01-02'}
    ${'2023 Jan 02'}                | ${'2023-01-02'}
    ${'2023 January 02'}            | ${'2023-01-02'}
    ${'2023 December 2'}            | ${'2023-12-02'}
    ${'02 January 2023'}            | ${'2023-01-02'}
    ${'2 December 2023'}            | ${'2023-12-02'}
    ${'31/1/2023'}                  | ${'2023-01-31'}
    ${'02/01/2023'}                 | ${'2023-01-02'}
    ${'02.01.2023'}                 | ${'2023-01-02'}
    ${'02/01/23'}                   | ${'2023-01-02'}
    ${'2-1-2023'}                   | ${'2023-01-02'}
    ${'02-01-2023'}                 | ${'2023-01-02'}
    ${'2000-02-29'}                 | ${'2000-02-29'}
    ${'today'}                      | ${todayIso}
    ${''}                           | ${'Invalid Date'}
    ${null}                         | ${'Invalid Date'}
    ${undefined}                    | ${'Invalid Date'}
    ${'2019'}                       | ${'Invalid Date'}
    ${'2001-02-29'}                 | ${'Invalid Date'}
    ${'2023-00-02'}                 | ${'Invalid Date'}
    ${'2023-01-00'}                 | ${'Invalid Date'}
    ${'a-01-02'}                    | ${'Invalid Date'}
    ${'2023-a-02'}                  | ${'Invalid Date'}
    ${'2023-01-a'}                  | ${'Invalid Date'}
    ${'2023-01'}                    | ${'Invalid Date'}
    ${'Invalid Date'}               | ${'Invalid Date'}
    ${new SimpleDate('2023-01-02')} | ${'2023-01-02'}
    ${new Date('2023-01-02')}       | ${'2023-01-02'}
  `(
    'constructor creates $expected when input is $input',
    ({ input, expected }) => {
      expect(new SimpleDate(input).toString()).toBe(expected);
    }
  );

  test.each`
    year      | month         | day     | expected
    ${2023}   | ${3}          | ${4}    | ${'2023-03-04'}
    ${2023}   | ${'Feb'}      | ${4}    | ${'2023-02-04'}
    ${2023}   | ${'February'} | ${4}    | ${'2023-02-04'}
    ${23}     | ${'February'} | ${4}    | ${'2023-02-04'}
    ${'2023'} | ${'5'}        | ${'6'}  | ${'2023-05-06'}
    ${'2023'} | ${'a'}        | ${'2'}  | ${'Invalid Date'}
    ${'2023'} | ${'a'}        | ${null} | ${'Invalid Date'}
  `(
    'constructor creates $expected when input is $year, $month, $day',
    ({ year, month, day, expected }) => {
      expect(new SimpleDate(year, month, day).toString()).toBe(expected);
    }
  );

  it('should set internal date to be correct as of the input and display', () => {
    const base = '2023-01-02';
    const simpleDate = new SimpleDate(base);

    expect(simpleDate.toString()).toBe(base);
    expect(simpleDate.date).toStrictEqual(new Date(2023, 0, 2));
  });

  test.each`
    dateOne                         | dateTwo                         | isEqualTo | isBefore | isOnOrBefore | isAfter  | isOnOrAfter
    ${'2023-01-02'}                 | ${'2023-01-02'}                 | ${true}   | ${false} | ${true}      | ${false} | ${true}
    ${'2023-01-01'}                 | ${'2023-01-02'}                 | ${false}  | ${true}  | ${true}      | ${false} | ${false}
    ${'2023-01-02'}                 | ${'2023-01-01'}                 | ${false}  | ${false} | ${false}     | ${true}  | ${true}
    ${'2023-01-02'}                 | ${'foo'}                        | ${false}  | ${false} | ${false}     | ${false} | ${false}
    ${new SimpleDate('2023-01-02')} | ${new Date(2023, 0, 2)}         | ${true}   | ${false} | ${true}      | ${false} | ${true}
    ${new Date(2023, 0, 2)}         | ${new SimpleDate('2023-01-02')} | ${true}   | ${false} | ${true}      | ${false} | ${true}
    ${new Date(2023, 0, 1)}         | ${new SimpleDate('2023-01-01')} | ${true}   | ${false} | ${true}      | ${false} | ${true}
    ${new Date(2023, 0, 1)}         | ${new SimpleDate('2023-01-02')} | ${false}  | ${true}  | ${true}      | ${false} | ${false}
    ${'2023-01-a'}                  | ${'2023-01-02'}                 | ${false}  | ${false} | ${false}     | ${false} | ${false}
    ${'2023-01-01'}                 | ${'2023-01-a'}                  | ${false}  | ${false} | ${false}     | ${false} | ${false}
  `(
    '$dateOne to $dateTwo isEqualTo($isEqualTo) isBefore($isBefore) isOnOrBefore($isOnOrBefore) isAfter($isAfter) isOnOrAfter($isOnOrAfter)',
    ({
      dateOne,
      dateTwo,
      isEqualTo,
      isBefore,
      isOnOrBefore,
      isAfter,
      isOnOrAfter,
    }) => {
      expect(new SimpleDate(dateOne).isEqualTo(dateTwo)).toBe(isEqualTo);
      expect(new SimpleDate(dateOne).isBefore(dateTwo)).toBe(isBefore);
      expect(new SimpleDate(dateOne).isOnOrBefore(dateTwo)).toBe(isOnOrBefore);
      expect(new SimpleDate(dateOne).isAfter(dateTwo)).toBe(isAfter);
      expect(new SimpleDate(dateOne).isOnOrAfter(dateTwo)).toBe(isOnOrAfter);
    }
  );

  test.each`
    input           | format      | expected
    ${'2023-01-02'} | ${null}     | ${'02/01/2023'}
    ${'2023-01-02'} | ${'short'}  | ${'02/01/2023'}
    ${'2023-01-02'} | ${'medium'} | ${'2 Jan 2023'}
    ${'2023-01-02'} | ${'long'}   | ${'2 January 2023'}
    ${''}           | ${null}     | ${'Invalid Date'}
    ${null}         | ${null}     | ${'Invalid Date'}
    ${undefined}    | ${null}     | ${'Invalid Date'}
    ${'2001-02-29'} | ${null}     | ${'Invalid Date'}
  `(
    'should output $expected when toFormat is called with format $format',
    ({ input, format, expected }) => {
      expect(new SimpleDate(input).toFormat(format)).toBe(expected);
    }
  );

  test.each`
    date            | addition | type        | expected
    ${'2023-01-14'} | ${1}     | ${'day'}    | ${'2023-01-15'}
    ${'2023-01-14'} | ${'1'}   | ${'day'}    | ${'2023-01-15'}
    ${'2023-01-14'} | ${2}     | ${'days'}   | ${'2023-01-16'}
    ${'2023-01-14'} | ${1}     | ${'week'}   | ${'2023-01-21'}
    ${'2023-01-14'} | ${2}     | ${'weeks'}  | ${'2023-01-28'}
    ${'2023-01-14'} | ${4}     | ${'weeks'}  | ${'2023-02-11'}
    ${'2023-01-14'} | ${1}     | ${'month'}  | ${'2023-02-14'}
    ${'2023-01-14'} | ${2}     | ${'months'} | ${'2023-03-14'}
    ${'2023-01-14'} | ${1}     | ${'year'}   | ${'2024-01-14'}
    ${'2023-01-14'} | ${2}     | ${'years'}  | ${'2025-01-14'}
    ${'2023-01-14'} | ${null}  | ${'days'}   | ${'2023-01-14'}
    ${'2023-01-14'} | ${'🧀'}  | ${'days'}   | ${'2023-01-14'}
    ${'2023-01-14'} | ${'0'}   | ${'days'}   | ${'2023-01-14'}
  `(
    'should output $expected when an addition of $addition $type',
    ({ date, addition, type, expected }) => {
      expect(new SimpleDate(date).add(addition, type).iso).toBe(expected);
    }
  );

  test.each`
    date            | subtract | type        | expected
    ${'2023-01-14'} | ${1}     | ${'day'}    | ${'2023-01-13'}
    ${'2023-01-14'} | ${'1'}   | ${'day'}    | ${'2023-01-13'}
    ${'2023-01-14'} | ${2}     | ${'days'}   | ${'2023-01-12'}
    ${'2023-01-14'} | ${1}     | ${'week'}   | ${'2023-01-07'}
    ${'2023-01-14'} | ${2}     | ${'weeks'}  | ${'2022-12-31'}
    ${'2023-01-14'} | ${4}     | ${'weeks'}  | ${'2022-12-17'}
    ${'2023-01-14'} | ${1}     | ${'month'}  | ${'2022-12-14'}
    ${'2023-01-14'} | ${2}     | ${'months'} | ${'2022-11-14'}
    ${'2023-01-14'} | ${1}     | ${'year'}   | ${'2022-01-14'}
    ${'2023-01-14'} | ${2}     | ${'years'}  | ${'2021-01-14'}
    ${'2023-01-14'} | ${null}  | ${'days'}   | ${'2023-01-14'}
    ${'2023-01-14'} | ${'🧀'}  | ${'days'}   | ${'2023-01-14'}
    ${'2023-01-14'} | ${'0'}   | ${'days'}   | ${'2023-01-14'}
  `(
    'should output $expected when a subtraction of $subtract $type',
    ({ date, subtract, type, expected }) => {
      expect(new SimpleDate(date).subtract(subtract, type).iso).toBe(expected);
    }
  );

  it('should throw an error when an incorrect add or subtract type is provided', () => {
    const date = new SimpleDate('2023-01-14');

    expect(() => {
      date.add(1, '🧀' as any);
    }).toThrow();

    expect(() => {
      date.subtract(1, '🐁' as any);
    }).toThrow();
  });

  test.each`
    dateOne         | dateTwo         | expected
    ${'2023-01-14'} | ${'2023-01-14'} | ${0}
    ${'2023-01-14'} | ${'2023-01-13'} | ${-1}
    ${'2023-01-14'} | ${'2023-01-15'} | ${1}
    ${'2023-01-14'} | ${'2023-03-02'} | ${47}
    ${'2023-01-🧀'} | ${'2023-01-15'} | ${NaN}
    ${'2023-01-14'} | ${'2023-01-🐁'} | ${NaN}
  `(
    '$dateOne getNumberOfDaysTo $dateTwo should output $expected',
    ({ dateOne, dateTwo, type, expected }) => {
      expect(new SimpleDate(dateOne).getNumberOfDaysTo(dateTwo)).toBe(expected);
    }
  );
});
