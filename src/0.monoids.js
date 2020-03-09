// Monoid = Semigroup + identity
// closed (not change the data type) + associative = parallel

//exp:
// Good: (1 + 2) + 6
// 2 * 5 * 8
// true && true && false

// Bad: 10 / 4/ 2

const { List } = require("immutable-ext");

const Sum = x => ({
  x,
  concat: other => {
    return Sum(x + other.x);
  }
});
Sum.empty = () => Sum(0);
const res = Sum.empty().concat(Sum(5));
console.log(res);

const Product = x => ({
  x,
  concat: other => {
    return Product(x * other.x);
  }
});
Product.empty = () => Product(1);
const res1 = Product(3)
  .concat(Product(5))
  .concat(Product.empty());
console.log(res1);

const Any = x => ({
  x,
  concat: other => {
    return Any(other.x || x);
  }
});
Any.empty = () => Any(false);
const res2 = Any(false).concat(Any(true));
console.log(res2);

const All = x => ({
  x,
  concat: other => {
    return All(other.x && x);
  }
});
All.empty = () => All(true);

// Monoid looks like Reduce
const res3 = [1, 2, 3].map(Sum).reduce((acc, curr) => acc.concat(curr));
console.log(res3);

const res4 = [].map(Sum).reduce((acc, curr) => acc.concat(curr), Sum.empty());
console.log(res4);

// Using fold
// .map(All).reduce(() => {}, All.empty())
const res5 = List([true, false, true]).foldMap(All, All.empty());
console.log(res5);
