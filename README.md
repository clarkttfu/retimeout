# retimeout

Wraps a function call and returns a resettable timer.

- A function might not be called until some conditions are met
- setInterval is not flexible enough to adjust the delay time
- merge sequential expensive calls into one

## Get started

```
const resettable = require('retimeout')(path => persist(path)), new Date)

resettable.reset(1000)
```

## API

### retimeout([binding], fn, [...args])

Create a callback wrapper. If `binding` is omitted, `fn` will be invoked with `null`.
Or if you want to call a method, you must pass `this` to `binding`.

### retimeout.set(milliseconds)

Set the global default delay time so you can call the reset methods without argument.

### reset(milliseconds) method

Reset internal timer with milliseconds

### clear() method

Clear internal timer

### do() method

Invoke the wrapped function or method immediately.