export function arrayWithoutItem<T>(arr: Array<T>, value: T): Array<T> {
  const arrayCopy = [...arr];
  const index = arrayCopy.indexOf(value);
  if (index > -1) {
    arrayCopy.splice(index, 1);
  }
  return arrayCopy;
}
