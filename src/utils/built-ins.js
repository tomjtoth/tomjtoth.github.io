Array.prototype.toSortedByKey = function (
  key,
  {
    comparator = (a, b) => {
      if (a[key] === undefined || b[key] === undefined)
        throw new Error("invalid sorting key");

      const val_left = ic ? a[key] : a[key].toLowerCase();
      const val_right = ic ? b[key] : b[key].toLowerCase();

      if (val_left < val_right) return desc ? 1 : -1;
      if (val_left > val_right) return desc ? -1 : 1;
      return 0;
    },
    ignoreCase: ic = false,
    desc = false,
  } = {}
) {
  // not mutating current state
  const arr = [...this];
  arr.sort(comparator);
  return arr;
};
