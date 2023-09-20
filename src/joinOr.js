function joinOr(array, delimiter = ", ", word = "or") {
  if (array.length === 0) {
    return "";
  } else if (array.length === 1) {
    return `${array[0]}`;
  } else if (array.length === 2) {
    return `${array[0]} ${word} ${array[1]}`;
  } else {
    let arrCopy = array.slice();
    arrCopy.pop();
    return `${arrCopy.join(delimiter)}${delimiter}${word} ${
      array[array.length - 1]
    }`;
  }
}

// console.log(joinOr([1, 2, 3])); // => "1, 2, or 3"
// console.log(joinOr([1, 2, 3], "; ")); // => "1; 2; or 3"
// console.log(joinOr([1, 2, 3], ", ", "and")); // => "1, 2, and 3"
// console.log(joinOr([])); // => ""
// console.log(joinOr([5])); // => "5"
// console.log(joinOr([1, 2])); // => "1 or 2"

module.exports = {
  joinOr,
};
