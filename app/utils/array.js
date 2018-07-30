export function sortByCounter(a, b) {
  if (a.counter < b.counter) {
    return -1;
  }

  if (a.counter > b.counter) {
    return 1;
  }

  return 0;
}
