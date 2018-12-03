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
