export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// find any common elements in two arrays
export function findCommonElements(arr1: any[], arr2: any[]) {
  return arr1.some((item) => arr2.includes(item));
}