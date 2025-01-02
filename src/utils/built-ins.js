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
