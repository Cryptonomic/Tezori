export function sortByOrder(a, b) {
  const aOrder = a.get('order');
  const bOrder = b.get('order');

  if (aOrder < bOrder) {
    return -1;
  }

  if (aOrder > bOrder) {
    return 1;
  }

  return 0;
}
