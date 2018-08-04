export function sortArr({ sortOrder, sortBy }) {
  return (a, b) => {
    const asc = sortOrder === 'asc';
    const aOrder = a.get(sortBy);
    const bOrder = b.get(sortBy);

    if (aOrder < bOrder) {
      return asc ? -1 : 1;
    }

    if (aOrder > bOrder) {
      return asc ? 1 : -1;
    }

    return 0;
  };
}
