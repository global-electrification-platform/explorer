'use strict';

/**
 * Adds 0s to a number until it becomes the specified length
 *
 * @param {number} value The value pad
 * @param {number} len The desired length
 */
export function padNumber (value, len = 0) {
  value = value.toString();
  while (value.length < len) {
    value = `0${value}`;
  }
  return value;
}

/**
 * Make an array where each cell is 0.
 *
 * @param {number} length Array length
 */
export function makeZeroFilledArray (length) {
  return Array.apply(null, {
    length
  }).map(() => 0);
}

/**
 * Clone array and change a cell. Based on this solution:
 *
 *  - https://medium.com/@giltayar/immutably-setting-a-value-in-a-js-array-or-how-an-array-is-also-an-object-55337f4d6702
 *
 * @param {number} array Source array
 * @param {number} index Cell index
 * @param {object} value Cell value
 */
export function cloneArrayAndChangeCell (array, index, value) {
  return Object.assign([...array], { [index]: value });
}

export function objForeach (obj, callbackFn) {
  return Object.keys(obj).some(k => callbackFn(obj[k], k));
}

/**
 * Rounds a number to a specified amount of decimals.
 *
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to keep. Default to 2
 */
export function round (value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Adds spaces every 3 digits and rounds the number.
 *
 * @param {number} num The number to format.
 * @param {number} decimals Amount of decimals to keep. (Default 2)
 * @param {boolean} forceDecimals Force the existence of decimal. (Default false)
 *                  Eg: Using 2 decimals and force `true` would result:
 *                  formatThousands(1 /2, 2, true) => 0.50
 *
 * @example
 * formatThousands(1)               1
 * formatThousands(1000)            1 000
 * formatThousands(10000000)        10 000 000
 * formatThousands(1/3)             0.33
 * formatThousands(100000/3)        33 333.33
 * formatThousands()                --
 * formatThousands('asdasdas')      --
 * formatThousands(1/2, 0)          1
 * formatThousands(1/2, 0, true)    1
 * formatThousands(1/2, 5)          0.5
 * formatThousands(1/2, 5, true)    0.50000
 *
 */
export function formatThousands (num, decimals = 2, forceDecimals = false) {
  // isNaN(null) === true
  if (isNaN(num) || (!num && num !== 0)) {
    return '--';
  }

  const repeat = (char, length) => {
    let str = '';
    for (let i = 0; i < length; i++) str += char + '';
    return str;
  };

  let [int, dec] = Number(round(num, decimals))
    .toString()
    .split('.');
  // Space the integer part of the number.
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // Round the decimals.
  dec = (dec || '').substr(0, decimals);
  // Add decimals if forced.
  dec = forceDecimals ? `${dec}${repeat(0, decimals - dec.length)}` : dec;

  return dec !== '' ? `${int}.${dec}` : int;
}

/**
 * Format key indicators
 *
 * @param {number} value The value to round
 * @param {string} type The type of indicator. One of: 'metric', 'power'
 * @param {number} decimals Amount of decimals to keep. (Default: 0)
 *
 */
export function formatKeyIndicator (val, type, decimals) {
  let unit;
  let divider;
  let digits = 1;

  // 'power' is reported in kW. Convert to to Watt before formatting
  const n = Math.abs(type === 'power' ? val * 1000 : val);
  const isNeg = val < 0;

  if (n > 1000000000) {
    // 10^9 = gigawatt
    unit = type === 'power' ? 'G' : 'B';
    divider = 1000000000;
    digits = 1;
  } else if (n > 1000000) {
    unit = 'M';
    divider = 1000000;
    digits = 0;
  } else if (n > 1000) {
    unit = 'k';
    divider = 1000;
    digits = 0;
  } else {
    unit = '';
    divider = 1;
    digits = 0;
  }

  if (type === 'power') {
    unit = `${unit}W`;
  } else if (type === 'co2') {
    unit = `${unit}/kt CO2 eq`;
  } else {
    unit = unit;
  }

  return `${isNeg ? '-' : ''}${(n / divider).toLocaleString('en-US', {
    minimumFractionDigits: typeof decimals === 'number' ? decimals : digits,
    maximumFractionDigits: typeof decimals === 'number' ? decimals : digits
  })} ${unit}`;
}
