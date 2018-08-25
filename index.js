'use strict'
const symFn = Symbol('bound function')
const symThisArg = Symbol('this argument of the bound function')
const symArgs = Symbol('arguments for invoking bound function')
const symOnTimeout = Symbol('the do method bound with current instance of Retimeout')
const symTimeout = Symbol('internal timer of setTimeout result')
const symDelay = Symbol('time to delay in ms')
const symStart = Symbol('start point of the first call of reset series')
const symMaximumDelay = Symbol('maximum delay in ms')

module.exports = Retimeout

function Retimeout (fn, ...args) {
  if (!(this instanceof Retimeout)) {
    return new Retimeout(fn, ...args)
  }

  if (typeof (fn) === 'function') {
    this[symFn] = fn
    this[symThisArg] = null
    this[symArgs] = args
    this[symTimeout] = null
    this[symStart] = null
    this[symDelay] = 1000
    this[symMaximumDelay] = Number.POSITIVE_INFINITY
    this[symOnTimeout] = this.do.bind(this, true)
  } else {
    throw Error('a callback function must be supplied')
  }
  Object.defineProperty(this, 'delayed', {
    get: function () { return this[symStart] }
  })
}

Retimeout.prototype.rebind = function (thisArg, ...args) {
  this[symThisArg] = thisArg
  this[symArgs] = args
  return this
}

Retimeout.prototype.reset = function (msDelay, msMaxDelay) {
  if (typeof msDelay === 'number' && msDelay >= 0) {
    this[symDelay] = msDelay
  }
  if (typeof msMaxDelay === 'number') {
    if (msMaxDelay <= this[symDelay]) {
      throw Error('delay time must be less than the maximum delay time')
    }
    this[symMaximumDelay] = msMaxDelay
  }
  if (this.clear()[symStart] === null) {
    this[symStart] = Date.now()
  }
  this[symTimeout] = setTimeout(this[symOnTimeout],
    Math.min(this[symDelay], this[symMaximumDelay] - Date.now() + this[symStart])
  )
  return this
}

Retimeout.prototype.binding = function (msDelay, msMaxDelay) {
  return this.reset.bind(this, msDelay, msMaxDelay)
}

Retimeout.prototype.do = function (clear = true) {
  this[symStart] = null
  if (clear) this.clear()
  if (this[symFn].hasOwnProperty('prototype')) {
    this[symFn].call(this[symThisArg], ...this[symArgs])
  } else {
    this[symFn]()
  }
  return this
}

Retimeout.prototype.clear = function () {
  clearTimeout(this[symTimeout])
  this[symTimeout] = null
  return this
}
