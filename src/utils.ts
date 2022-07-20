/** Get an array of the indices of truthy values in arr. */
export function getTruthyIndices<T>(arr: T[]) {
  return arr.reduce<number[]>((arr, value, index) => (Boolean(value) ? [...arr, index] : arr), []);
}

/** Transform each character in a string. */
export function mapString(str: string, fn: Parameters<typeof Array.prototype.map>[0]) {
  return str.split("").map(fn).join("");
}

/** Get a random item from an array. */
export function sample<T>(arr: ArrayLike<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Get an array of elements with a selector, NodeList, Node, or HTMLCollection. */
export function getElements(obj: string | Node | NodeList | HTMLCollection): Node[] {
  if (typeof obj === "string") {
    return Array.from(document.querySelectorAll(obj));
  }

  if (obj instanceof NodeList || obj instanceof HTMLCollection) {
    return Array.from(obj);
  }

  return [obj];
}
