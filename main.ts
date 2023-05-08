// ESM syntax is supported.
export {};

type SimpleDateInput = SimpleDate | Date | String;

type SimpleDateModPeriod =
  | "year"
  | "years"
  | "month"
  | "months"
  | "week"
  | "weeks"
  | "day"
  | "days";

export class SimpleDate {
  invalidDateMessage = "Invalid Date";

  year: number;
  month: number;
  monthIndex: number;
  day: number;

  date: Date;
  isValid: boolean;

  /** A date portion of an ISO8601 date */
  iso: string;

  /** A serialised number formed from padded year, month and day. Ideal for comparing and sorting */
  serial = NaN;

  constructor(
    date?: SimpleDateInput,
    month?: number | string,
    day?: number | string
  ) {
    if (date instanceof SimpleDate) {
      return new SimpleDate(date.iso);
    }

    if (month != null) {
      // if (year month and day are string or number)
      this.year = Number(this.date);
      this.monthIndex = Number(this.month) - 1;
      this.month = Number(month);
      this.day = Number(day);
    } else if (typeof date === "string" && date !== this.invalidDateMessage) {
      // Remove ISO8601 time if present
      const timeMaker = date.search(/[0-9]T/);
      if (timeMaker !== -1) {
        date = date.slice(0, timeMaker + 1); //Refactor to immut
      }

      const parts = date.split(/[.\s/-]/g);

      if (parts.length === 3) {
        const month: string | number = parts[1];

        // Rewrite
        if (parts[0].length === 4) {
          [this.year, , this.day] = parts.map((part) => Number(part));
        } else {
          [this.day, , this.year] = parts.map((part) => Number(part));
        }

        //Extract month if words = use dummy date to avoid data smoothing
        this.monthIndex = Number.isNaN(Number(month))
          ? new Date(`2000 ${month} 14`).getMonth()
          : Number(month) - 1;
      } else if (parts.length === 1 && date.length === 8) {
        this.year = Number(date.substr(0, 4));
        this.monthIndex = Number(date.substr(4, 2)) - 1;
        this.day = Number(date.substr(6, 2));
      }
    } else if (date instanceof Date) {
      this.year = date.getFullYear();
      this.monthIndex = date.getMonth();
      this.day = date.getDate();
    }

    // this.isValid = this.isValidRaw(this.year, this.monthIndex, this.day);

    this.date = new Date(this.year, this.monthIndex, this.day, 0, 0, 0); // Need zeroing?
    this.isValid = !isNaN(this.date.getTime());

    if (this.isValid) {
      // this.date = new Date(this.year, this.monthIndex, this.day, 0, 0, 0); // Need zeroing?
      this.month = this.monthIndex + 1;

      const parts = [
        String(this.year).padStart(4, "0"),
        String(this.month).padStart(2, "0"),
        String(this.day).padStart(2, "0"),
      ];

      this.iso = parts.join("-");
      this.serial = Number(parts.join(""));
    }

    Object.freeze(this);
  }

  /**
   * @returns A date portion of an ISO8601 date if valid, otherwise `Invalid Date`
   */
  toString(): string {
    return this.isValid ? this.iso : this.invalidDateMessage;
  }

  toFormat(type?: any): string {
    if (!this.isValid) {
      return this.invalidDateMessage;
    }

    // todo long medium short
    return [this.day, this.month, this.year].join("/");
  }

  toValue(): number {
    return this.serial;
  }

  isEqualTo(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this === this.normalise(comparisonDate);
  }

  isBefore(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this < this.normalise(comparisonDate);
  }

  isAfter(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this > this.normalise(comparisonDate);
  }

  isOnOrBefore(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this >= this.normalise(comparisonDate);
  }

  isOnOrAfter(comparisonDate: SimpleDateInput): boolean {
    if (!this.isValid) {
      return false;
    }

    return this <= this.normalise(comparisonDate);
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

    const refDate = new Date(this.date);

    if (type === "year" || type === "years") {
      refDate.setFullYear(refDate.getFullYear() + Number(num));
      return new SimpleDate(refDate);
    }

    if (type === "month" || type === "months") {
      refDate.setMonth(refDate.getMonth() + Number(num));
      return new SimpleDate(refDate);
    }

    if (type === "week" || type === "weeks") {
      refDate.setDate(refDate.getDate() + Number(num) * 7);
      return new SimpleDate(refDate);
    }

    if (type === "day" || type === "days") {
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

  private normalise(date?: SimpleDateInput): SimpleDate {
    if (date instanceof SimpleDate) {
      return date;
    }

    return new SimpleDate(date);
  }
}
