const List = Immutable.List;
const Map = Immutable.Map;

const Sum = x => ({
  x: x,
  concat: o => Sum(x + o.x),
  toString: () => `Sum(${x})`
});
Sum.empty = () => Sum(0);

const Product = x => ({
  x: x,
  concat: o => Product(x * o.x),
  toString: () => `Product(${x})`
});
Product.empty = () => Product(1);

const Any = x => ({
  x: x,
  concat: o => Any(x || o.x),
  toString: () => `Any(${x})`
});
Any.empty = () => Any(false);

const Max = x => ({
  x,
  concat: other => Max(Math.max(x, other.x)),
  toString: () => `Max(${x})`
});
Max.empty = () => Max(-Infinity);

// List([1,2]) // [1,2]
// List.of(2) // [2]

// Ex1: reimplement sum using foldMap and the Sum Monoid
// =========================

//var sum = xs => List(xs).reduce((acc, x) => acc + x, 0)
var sum = xs => List(xs).foldMap(Sum, Sum.empty());

QUnit.test("Ex1: sum", assert => {
  assert.equal(String(sum([1, 2, 3])), "Sum(6)");
});

// Ex2: reimplement lessThanZero using foldMap and the Any Monoid
// =========================

//var anyLessThanZero = xs =>
//  List(xs).reduce((acc, x) => acc < 0 ? true : false, false)
var anyLessThanZero = xs => List(xs).foldMap(x => Any(x < 0), Any.empty());

QUnit.test("Ex2: anyLessThanZero", assert => {
  assert.equal(String(anyLessThanZero([-2, 0, 4])), "Any(true)");
  assert.equal(String(anyLessThanZero([2, 0, 4])), "Any(false)");
});

// Ex3: Rewrite the reduce with a Max monoid (see Sum/Product/Any templates above)
// =========================

//var max = xs =>
//  List(xs).reduce((acc, x) => acc > x ? acc : x, -Infinity)
var max = xs => List(xs).foldMap(Max, Max.empty());

QUnit.test("Ex3: max", assert => {
  assert.equal(String(max([-2, 0, 4])), "Max(4)");
  assert.equal(String(max([12, 0, 4])), "Max(12)");
});

// Ex4 (Bonus): Write concat for Tuple
// =========================

const Tuple = (_1, _2) => ({
  _1,
  _2,
  concat: o => {
    const sum = o._1.concat(_1);
    const product = o._2.concat(_2);
    return Tuple(sum, product);
  } // write me
});

QUnit.test("Ex4: tuple", assert => {
  const t1 = Tuple(Sum(1), Product(2));
  const t2 = Tuple(Sum(5), Product(2));
  const t3 = t1.concat(t2);
  assert.equal(String(t3._1), "Sum(6)");
  assert.equal(String(t3._2), "Product(4)");
});
