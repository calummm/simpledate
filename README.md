# 📅 Simple date

Simpledate is a focused date library. Unlike the native date implementation and many other date libraries, Simpledate only cares about valid years, months and days. Simpledate is useful when time and timezones do not matter, such as for validating birthday dates, outputting fixed dates for events and where multiple timezones simply do not matter.

It takes in common date patterns and encourages the use of an ISO date portion for transmitting date information between systems.

- Avoids arbitrary times and time offsets between systems
- Provides immutable objects (cannot be modified, only cloned)
- Allows easy comparisons between dates using convenience functions

## 💾 Installation

```
  npm install @calummm/simpledate --save
```

## 💻 Usage

```javascript
const dateOne = new SimpleDate('10/05/2023');

let dateTwo = new SimpleDate('10/05/2023');

console.log(dateOne.isOnOrBefore(dateTwo)); // true

dateTwo = dateTwo.add(1, 'month');

console.log(dateOne.isAfter(dateTwo)); // false

console.log(dateOne.isAfter('10.10.2010')); // true

console.log(new SimpleDate('29/02/2001').isValid); // false

console.log(dateOne.iso); // '2023-05-10'
console.log(dateOne.date); // Date Wed May 10 2023 10:00:00 GMT+1000 (AEST)
```
