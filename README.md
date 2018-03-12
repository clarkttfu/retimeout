# retimeout

Wraps a function call and returns a resettable timer:

- A function might not be called until some conditions are met
- setInterval is not flexible enough to adjust the delay time
- merge sequential expensive calls into one

## Get started

```
const trigger = () => console.log('%o trigger only if not reset after 1 sec', new Date)
const timer = require('./index').set(1000)(trigger)

var stepCosts = [ 310, 990, 1000, 500 ]
stepCosts.reduce((pre, cur, i) => pre.then(() => {
  console.log('%o step %d cost:', new Date, i + 1, cur)
  timer.reset()
  return new Promise(resolve => setTimeout(() => resolve(), cur))
}), Promise.resolve())
```

## API

### retimeout([binding], fn, [...args])

Set the binding object and create a callback wrapper. If `binding` is omitted, `fn` will be invoked with `null`.

### retimeout.set([milliseconds=500])

Set the global default delay time so you can call the `reset` method without argument.

### reset([milliseconds]) method

Reset internal timer. Use the global delay setting if `milliseconds` is omitted.

### do() method

Invoke the wrapped function or method immediately.

### clear() method

Clear internal timer.

### release() method

Unbind the callback by setting references to null and return the internel timer.
