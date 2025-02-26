// memoization and recursive

// girilen verinin collatz dizisinin uzunluğunu return eder
function collatzSequence(n, cache = new Map(), sequence = []) {
  sequence.push(n);

  if (n === 1) return sequence;

  if (cache.has(n)) return sequence.concat(cache.get(n));

  let next = n % 2 === 0 ? n / 2 : 3 * n + 1;
  return collatzSequence(next, cache, sequence);
}

// girilen veriye kadar olan sayıları arasında en uzun
// collatz dizisine sahip olan dizinin başlangıç sayısını ve dizinin uzunluğunu return eder
function longestCollatzSequence(limit) {
  let maxLength = 0;
  let startingNumber = 0;
  let cache = new Map();

  for (let i = 1; i <= limit; i++) {
    let sequence = collatzSequence(i, cache);
    if (sequence.length > maxLength) {
      maxLength = sequence.length;
      startingNumber = i;
    }
  }

  const result = `Max Length: ${maxLength}, Starting Number: ${startingNumber}`;
  return result;
}
