# retimeout

Wraps a function call and returns a resettable timer:

- A function might not be called until some conditions are met
- setInterval is not flexible enough to adjust the delay time
- merge sequential expensive calls into one

## Get started

```
const echo = () => console.log(new Date)
const timer = require('retimeout')(echo)

// loop until connditions are met
timer.reset(1000)
```

## API

### retimeout([binding], fn, [...args])

Set the binding object and create a callback wrapper. If `binding` is omitted, `fn` will be invoked with `null`.

### retimeout.set(milliseconds)

Set the global default delay time so you can call the `reset` method without argument.

### reset([milliseconds]) method

Reset internal timer. Use the global delay setting if `milliseconds` is omitted.

### do() method

Invoke the wrapped function or method immediately.

### clear() method

Clear internal timer.

### release() method

Unbind the callback by setting references to null and return the internel timer.