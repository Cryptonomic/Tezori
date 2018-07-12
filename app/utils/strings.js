export function limitLength(str: string, limit: number, indicator: string = '...') {
  if ( str.length <= limit ) {
    return str;
  }

  return str.slice(0, limit - indicator.length) + indicator;
}
