# retimeout

Wraps a function call and returns a resettable timer:

- A function call should be delayed until some conditions are met
- setInterval is not flexible enough to adjust the delay time
- merge sequential expensive calls into once

## Get started

```
const Retimeout = require('retimeout')

const timer1 = new Retimeout(() => console.log('called after 1 sec'))
timer1.reset() // reset in 1 second by default

const timer2 = Retimeout(input => console.log('reset until maximum delay:', input))
setInterval(timer2.binding(15, 5000), 10)

// clear the timer and invoke immediately
timer2.rebind(null, 'change input').do()
```

## API

__!!! API changed since 0.0.x, read the test cases for more information.__

### Retimeout(fn, [...args])

Create a callback wrapper. `fn` will be invoked with `null`.

### reset(delay = 1000, maxDelay = Number.POSITIVE_INFINITY) method

Reset and start the internal timer. `delay` and `maxDelay` will be remembered!

### binding(delay, maxDelay) method

Sugar method that equals to `timer.reset.bind(timer, delay, maxDelay)`

### do([clear = true]) method

Invoke the wrapped function and clear the timer if called with `true`.

### clear() method

Clear internal timer

### rebind(thisArg, args) method

Change binding context for the wrapped function

### delayed readonly property

Milliseconds has deferred the function invoking
