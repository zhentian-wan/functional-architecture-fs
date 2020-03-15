## [Semigroup](./src/monoids/0.monoids.js)

### Keypoints:

_closed + associative_

_foldMap is the same as .map().reduce()_

## [Reader Functor](./src/function-modelling/0.reader.js)

### Keypoints:

Reader: _Similar idea to Dependency injection_

## [Endo Functor](./src/function-modelling/0.reader.js)

### Keypoints:

Endo: _Same input and output types_

contramap: _transform the input before it passing to the function_

## [contramap](./src/function-modelling/1.contramap.js)

### Keypoints:

contramap: _apply transform function on input arguements_

## [Reducer](./src/function-modelling/2.reducer.js)

### Keypoints:

reducer: _Modelling the reducer pattern_

## [Reducer, Endo](./src/function-modelling/3.endoreducer.js)

### Keypoints:

Endo + Fn = Reducer:

```js
// (acc, a) -> acc
// (a, acc) -> acc
// a -> acc -> acc
// a -> (acc -> acc)
// a -> Endo(acc -> acc)
// Fn(a -> Endo(acc -> acc))
```
