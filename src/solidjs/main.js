let context = []

function cleanup(observer) {
  for (const dep of observer.dependencies) {
    dep.delete(observer)
  }
}

function subscribe(observer, subscriptions) {
  subscriptions.add(observer)
  observer.dependencies.add(subscriptions)
}

function untrack(fn) {
  const prevContext = context
  context = []
  const res = fn()
  context = prevContext
  return res
}

function createSignal(value) {
  const subscriptions = new Set()
  const read = () => {
    const observer = context[context.length - 1]
    if (observer) subscribe(observer, subscriptions)
    return value
  };
  const write = (newValue) => {
    value = newValue
    for (const observer of [...subscriptions]) {
      observer.execute()
    }
  };

  return [read, write];
}

function createEffect(fn) {
  const effect = {
    execute() {
      cleanup(effect)
      context.push(effect)
      fn()
      context.pop()
    },
    dependencies: new Set()
  }
  context.push({execute: fn})
  effect.execute()
}

function createMemo(fn) {
  const [singal, setSingal] = createSignal()
  createEffect(() => {
    setSingal(fn())
  })
  return singal
}

const [count, setCount] = createSignal(0);
const [count2, setCount2] = createSignal(2);
const [show, setShow] = createSignal(true);

const sum = createMemo(() => {
  return count() + count2()
})

createEffect(() => {
  console.log(untrack(() => count()))
  //console.log(count(), count2(), sum())
  // if (show()) console.log(count())
  // else console.log(count2())
})


setShow(false)
setCount(10)
setCount(20)