# 📅 Simple date [![Codecov Coverage](https://img.shields.io/codecov/c/github/calummm/simpledate/main.svg?style=flat-square)](https://codecov.io/gh/calummm/simpledate/)

Simpledate is a focused date library. Unlike the native date implementation and many other date libraries, Simpledate only cares about valid years, months and days. Simpledate is useful when time and timezones do not matter, such as for validating birthday dates, outputting fixed dates for events and where multiple timezones simply do not matter.

It takes in common date patterns and encourages the use of an ISO date portion for transmitting date information between systems.

- Uses native date functions internally to ensure consistency
- Takes 1 based months to avoid common off-by-one month errors
- Avoids arbitrary times and time offsets between systems
- Provides immutable objects (cannot be modified, only cloned)
- Allows easy comparisons between dates using convenience functions
- Provides basic formatting to the most common legible formats

## 💾 Installation

```
  npm install @calummm/simpledate --save
```

## 💻 Usage

```javascript
const dateOne = new SimpleDate('9/06/2023');

let dateTwo = new SimpleDate('9/06/2023');

console.log(dateOne.isOnOrBefore(dateTwo)); // true

dateTwo = dateTwo.add(1, 'month');

console.log(dateOne.isAfter(dateTwo)); // false

console.log(dateOne.isAfter('10.10.2010')); // true

console.log(new SimpleDate('29/02/2001').isValid); // false

console.log(dateOne.iso); // '2023-06-09'
console.log(dateOne.date); // Date Wed June 9 2023 10:00:00 GMT+1000 (AEST)

console.log(dateOne.toFormat('iso')); // '2023-06-09'
console.log(dateOne.toFormat('short')); // '09/06/2023'
console.log(dateOne.toFormat('medium')); // '9 Jun 2023'
console.log(dateOne.toFormat('long')); // '9 June 2023'
console.log(dateOne.toFormat('isotime')); // '2023-06-09T00:00:00'
console.log(dateOne.toFormat('isofull')); // '2023-06-09T00:00:00.000Z'

console.log(new SimpleDate('🧀').toFormat('short', 'oops')); // 'oops'
```
