var GLOBAL_DELAY = 100

function Delay (binding, fn, ...args) {
  if (! (this instanceof Delay)) {
    return new Delay(binding, fn, args)
  }

  if (typeof (binding) == 'function') {
    this._binding = null
    this._fn = binding
    this._args = fn === undefined ? [] : [ fn ].concat(args)
  } else if (typeof (fn) == 'function') {
    this._binding = binding
    this._fn = fn
    this._args = args
  } else {
    throw Error('a callback function must be supplied')
  }
}

Delay.set = function (ms = GLOBAL_DELAY) {
  GLOBAL_DELAY = ms
}

Delay.prototype.bind = function(binding) {
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

Delay.prototype.clear = function () {
  clearTimeout(this._timeout)
  this._timeout = null
  return this
}

Delay.prototype.do = function () {
  this.clear()
  this._fn.apply(this._binding, this._args)
  return this
}

module.exports = Delay
