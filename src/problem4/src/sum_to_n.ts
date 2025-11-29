/**
 * Three implementations of summation function
 * sum_to_n_a: Mathematical formula (O(1))
 * sum_to_n_b: Functional reduce (O(n) time, O(n) memory)
 * sum_to_n_c: Generator iteration (O(n) time, O(1) memory)
 */
import { validateInput } from "../validate/validate_Input";


/**
 * Approach A: Gauss formula
 * Complexity: O(1)
 */
export function sum_to_n_a(n: number): number {
  validateInput(n);
  return (n * (n + 1)) / 2;
}

/**
 * Approach B: Recursion
 * Complexity: O(n) time, O(n) space
 */
export function sum_to_n_b(n: number): number {
  validateInput(n);
  if (n === 0 ) return 0;
  if (n === 1) return 1;
  return n + sum_to_n_b(n - 1);
}

/**
 * Approach C: Generator iteration
 * Complexity: O(n) time, O(1) memory
 */
export function sum_to_n_c(n: number): number {
  validateInput(n);
  function* range(end: number) {
    for (let i = 1; i <= end; i++) yield i;
  }

  let total = 0;
  for (const num of range(n)) total += num;
  return total;
}
