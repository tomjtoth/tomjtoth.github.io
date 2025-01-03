if (Array.prototype.toToggled === undefined) {
  Array.prototype.toToggled = function (key) {
    const arr = [...this];
    arr.toggle(key);
    return arr;
  };
}

if (Array.prototype.toggle === undefined) {
  Array.prototype.toggle = function (key) {
    const idx = this.indexOf(key);
    if (idx === -1) {
      this.push(key);
    } else {
      this.splice(idx, 1);
    }
  };
}

if (Array.prototype.last === undefined)
  Array.prototype.last = function () {
    return this[this.length - 1];
  };

if (Number.prototype.between === undefined)
  Number.prototype.between = function (a, b) {
    if (typeof a !== "number" || typeof b !== "number")
      throw new Error("Number.between needs numbers for comparison");

    return a <= this && this <= b;
  };
