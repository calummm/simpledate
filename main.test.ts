import { SimpleDate } from './main';
import { describe, test, expect } from 'vitest';

describe('SimpleDate', () => {
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
});
