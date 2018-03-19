const process = require('process')
const Events = require('events')

var GLOBAL_DELAY = 1000

function Delay (binding, fn, ...args) {
  if (!(this instanceof Delay)) {
    return new (Function.prototype.bind.apply(Delay, [null, binding, fn].concat(args)))()
  }

  if (typeof (binding) == 'function') {
    this._binding = null
    this._fn = binding
    this._args = fn === undefined ? [] : [ fn ].concat(args)
  } else if (typeof (fn) == 'function') {
    this._binding = binding
    this._fn = fn
    this._args = args.slice()
  } else {
    throw Error('a callback function must be supplied')
  }
}

Delay.set = function (ms = GLOBAL_DELAY) {
  GLOBAL_DELAY = ms
  return Delay
}

Delay.prototype.triggerOn = function (emitter, ...events) {
  var target = process
  if (typeof emitter === 'string') {
    events.unshift(emitter)
  } else if (emitter instanceof Events) {
    target = emitter
  }
  var self = this
  events.forEach(event => {
    target.on(event, () => {
      self.do()
    })
  })
  return this
}

Delay.prototype.bind = function (binding) {
  this._binding = binding
  return this
}

Delay.prototype.reset = function (ms = GLOBAL_DELAY) {
  var self = this
  if (self._timeout) {
    clearTimeout(self._timeout)
  }
  self._timeout = setTimeout(() => {
    self._timeout = null
    self._fn.apply(self._binding, self._args)
  }, ms)
  return this
}

Delay.prototype.do = function (clear = true) {
  if (clear) this.clear()
  this._fn.apply(this._binding, this._args)
  return this
}

Delay.prototype.clear = function () {
  clearTimeout(this._timeout)
  this._timeout = null
  return this
}

module.exports = Delay
