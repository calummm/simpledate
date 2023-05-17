type SimpleDateInput = SimpleDate | Date | String;

type SimpleDateModPeriod =
  | 'year'
  | 'years'
  | 'month'
  | 'months'
  | 'week'
  | 'weeks'
  | 'day'
  | 'days';

export class SimpleDate {
  invalidDateMessage = 'Invalid Date';

  year: number | undefined;
  month: number | undefined;
  monthIndex: number | undefined;
  day: number | undefined;

  date: Date | undefined;
  isValid: boolean = false;

  /** A date portion of an ISO8601 date */
  iso: string = this.invalidDateMessage;

  /** A serialised number formed from padded year, month and day. Ideal for comparing and sorting */
  serial = NaN;

  private readonly defaultDate = new Date();

  private readonly longMonthNames = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ];
  private readonly shortMonthNames = [
    `Jan`,
    `Feb`,
    `Mar`,
    `Apr`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`,
  ];
  private readonly monthLengths = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];

  /**
   * Create a SimpleDate instance that has no concept of time or timezones
   * SimpleDate can be created using a string, a date, or clone another SimpleDate
   *
   * SimpleDate instances are immutable to prevent common date issues. Updating a SimpleDate using add or subtract should be assigned to a new or existing variable
   * Parsing dates that contain month words are possible but not recommended due to environment/browser differences
   *
   * @param {SimpleDateInput | number | string} date  yyyyMd or dMyy with forward-slash, hypen, dot or space delimiters (middle-endian is not supported) or a year
   * @param {string | number} [month] a one based based month (1 is January) or month word. Number preferred
   * @param {string | number} [day] the day of the month
   */
  constructor(
    date: SimpleDateInput | number | string,
    month?: number | string,
    day?: number | string
  ) {
    if (date instanceof SimpleDate) {
      return new SimpleDate(date.iso);
    }

    let _year: number | string = '';
    let _month: number | string = '';
    let _day: number | string = '';

    if (month != null && day != null) {
      _year = Number(date);
      _month = month;
      _day = Number(day);
    } else if (date === 'today') {
      _year = this.defaultDate.getFullYear();
      _month = this.defaultDate.getMonth() + 1;
      _day = this.defaultDate.getDate();
    } else if (typeof date === 'string' && date !== this.invalidDateMessage) {
      let datePart = date;
      // Remove ISO8601 time if present
      const timeMaker = date.search(/[0-9]T/);
      if (timeMaker !== -1) {
        datePart = date.slice(0, timeMaker + 1);
      }

      const parts = datePart
        .trim()
        .replace(/\s+/, ' ')
        .split(/[.\s/-]/g);

      if (parts.length === 3) {
        _month = parts[1];

        if (parts[0].length === 4) {
          _year = Number(parts[0]);
          _day = Number(parts[2]);
        } else {
          _year = Number(parts[2]);
          _day = Number(parts[0]);
        }
      } else if (parts.length === 1 && date.length === 8) {
        _year = Number(date.slice(0, 4));
        _month = Number(date.slice(5, 6));
        _day = Number(date.slice(7, 8));
      }
    } else if (date instanceof Date) {
      _year = date.getFullYear();
      _month = date.getMonth() + 1;
      _day = date.getDate();
    } else if (date != null && !isNaN(Number(date))) {
      const _epoch = new Date(0);
      _epoch.setUTCSeconds(Number(date) / 1000);
      _year = _epoch.getFullYear();
      _month = _epoch.getMonth() + 1;
      _day = _epoch.getDate();
    }

    if (String(_year).length === 2) {
      _year = Number(
        String(this.defaultDate.getFullYear()).slice(0, 2) + String(_year)
      );
    }

    // If month is provided as a word, attempt parse using native date methods
    if (isNaN(Number(_month))) {
      _month = new Date(`${_month} ${_day} ${_year}`).getMonth() + 1;
    }

    if (_year != undefined && _month != undefined && _day != undefined) {
      this.isValid = this.isValidManual(
        Number(_year),
        Number(_month) - 1,
        Number(_day)
      );

      if (this.isValid) {
        this.year = Number(_year);
        this.month = Number(_month);
        this.monthIndex = this.month - 1;
        this.day = Number(_day);

        this.date = new Date(this.year, this.monthIndex, this.day, 0, 0, 0);

        const parts = [
          String(this.year).padStart(4, '0'),
          String(this.month).padStart(2, '0'),
          String(this.day).padStart(2, '0'),
        ];

        this.iso = parts.join('-');
        this.serial = Number(parts.join(''));
      }
    }

    Object.freeze(this);
  }

  /**
   * @returns A date portion of an ISO8601 date if valid, otherwise `Invalid Date`
   */
  toString(): string {
    return this.isValid ? this.iso : this.invalidDateMessage;
  }

  toFormat(
    format?: 'iso' | 'long' | 'medium' | 'short',
    invalidDateMessage?: string
  ): string {
    if (!this.isValid) {
      return invalidDateMessage ?? this.invalidDateMessage;
    }

    if (format === 'iso') {
      return this.iso;
    }

    if (format === 'long') {
      return `${this.day} ${this.longMonthNames[this.monthIndex!]} ${
        this.year
      }`;
    }
    if (format === 'medium') {
      return `${this.day} ${this.shortMonthNames[this.monthIndex!]} ${
        this.year
      }`;
    }

    return [
      String(this.day).padStart(2, '0'),
      String(this.month).padStart(2, '0'),
      String(this.year).padStart(4, '0'),
    ].join('/');
  }

  valueOf(): number {
    return this.serial;
  }

  isEqualTo(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }
    return this.valueOf() === this.normalise(comparisonDate).valueOf();
  }

  isBefore(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this.valueOf() < this.normalise(comparisonDate).valueOf();
  }

  isAfter(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this.valueOf() > this.normalise(comparisonDate).valueOf();
  }

  isOnOrBefore(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this.valueOf() <= this.normalise(comparisonDate).valueOf();
  }

  isOnOrAfter(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this.valueOf() >= this.normalise(comparisonDate).valueOf();
  }

  /**
   * Returns a new instance of SimpleDate in the future modified by the set type
   * Care should be taken around months as most systems should use multiples of 4 weeks instead
   * @returns
   */
  add(num: number, type: SimpleDateModPeriod): SimpleDate {
    if (!this.isValid || num == null || isNaN(Number(num)) || type == null) {
      return new SimpleDate(this);
    }

    const refDate = new Date(this.date as Date);

    if (type === 'year' || type === 'years') {
      refDate.setFullYear(refDate.getFullYear() + Number(num));
      return new SimpleDate(refDate);
    }

    if (type === 'month' || type === 'months') {
      refDate.setMonth(refDate.getMonth() + Number(num));
      return new SimpleDate(refDate);
    }

    if (type === 'week' || type === 'weeks') {
      refDate.setDate(refDate.getDate() + Number(num) * 7);
      return new SimpleDate(refDate);
    }

    if (type === 'day' || type === 'days') {
      refDate.setDate(refDate.getDate() + Number(num));
      return new SimpleDate(refDate);
    }

    throw new Error(`Invalid date add type ${type}`);
  }

  /**
   * @see add
   * Returns a new instance of SimpleDate in the past modified by the set type
   * @returns
   */
  subtract(num: number, type: SimpleDateModPeriod): SimpleDate {
    return this.add(num * -1, type);
  }

  /**
   * @param {SimpleDateInput} comparisonDate
   * @returns {number} The number of days to the comparison date
   */
  getNumberOfDaysTo(comparisonDate: SimpleDateInput): number {
    if (!this.isValid) {
      return NaN;
    }

    const comparison = this.normalise(comparisonDate);
    if (!comparison.isValid) {
      return NaN;
    }

    return (
      Math.round(comparison.date!.getTime() - this.date!.getTime()) /
      (24 * 60 * 60 * 1000) // ms to days
    );
  }

  private normalise(date?: SimpleDateInput): SimpleDate {
    if (date instanceof SimpleDate) {
      return date;
    }

    return new SimpleDate(date as SimpleDateInput);
  }

  private isValidManual(
    year: number,
    monthIndex: number,
    day: number
  ): boolean {
    if (Number.isNaN(year) || Number.isNaN(monthIndex) || Number.isNaN(day)) {
      return false;
    }

    if (
      //String(year).length !== 4 || // TODO
      monthIndex < 0 ||
      monthIndex > 11 ||
      day < 1 ||
      day > 31
    ) {
      return false;
    }

    // Leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      this.monthLengths[1] = 29;
    }

    return day <= this.monthLengths[monthIndex];
  }
}
