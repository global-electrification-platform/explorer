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
  return Object.keys(obj).some(k => callbackFn(obj[k], k))
}
