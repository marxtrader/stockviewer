const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const result =array1.reduce(reducer)
console.log(result);