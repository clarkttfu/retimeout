const Retimeout = require('./index.js')

describe('Test cases', () => {
//
  it('should finish around delay time', done => {
    var delay = 50
    var timer = Retimeout(() => {
      if (timer.delayed >= delay) done()
      else done('should not be herer')
    }).reset(delay)
  })

  it('reset and finish at next loop', done => {
    var timer = Retimeout(() => {
      if (timer.delayed >= 20) done()
      else done('should not be herer')
    }).reset(10).reset(20)
  })

  it('clear successfully', done => {
    Retimeout(() => done('should not call')).reset(25).clear()
    setTimeout(done, 30)
  })

  it('do/invoke without clearing the timer', done => {
    var counter = 0
    var resettable = Retimeout(() => ++counter)
    resettable.reset(10).do(false).do(false)
    setTimeout(() => {
      if (counter === 3) done()
    }, 15)
  })

  it('do and clear the timer', done => {
    var counter = 0
    var resettable = Retimeout(() => ++counter)
    resettable.reset(10).do()
    setTimeout(() => {
      if (counter === 1) done()
    }, 60)
  })

  it('reset until maximum delay', done => {
    var interval = null
    var timer = Retimeout(() => {
      clearInterval(interval)
      if (timer.delayed < 50) done('should not be here')
      else done()
    }).reset(20, 50)
    interval = setInterval(timer.reset.bind(timer), 10)
  })

  it('binding returns bound reset method', done => {
    var timer = Retimeout(() => {
      if (timer.delayed < 10) done('should not be here')
      else done()
    })
    timer.binding(10)()
  })

  it('invokes with null by default', done => {
    new Retimeout(function () {
      if (this === global) done()
    }).reset(0)
  })

  it('support lazy re-bind', done => {
    var counter = 0
    var rebinding = {}
    var timer = new Retimeout(function (arg) {
      if (++counter === 1 && this !== global) done('not bind yet')
      else if (counter === 2 && this === rebinding && arg === 'hello') done()
    }).reset(0)
    // do not (sync) rebind immediately, it's faster than the async timer
    setTimeout(() => timer.rebind(rebinding, 'hello').reset(0))
  })

  it('re-bind do NOT work if fn is already bound', done => {
    var binding = {}
    var foo = function (arg) {
      if (this === binding && arg === 'foo') done()
      else done('the fn should not be re-bound')
    }
    var timer = new Retimeout(foo.bind(binding, 'foo')).reset(10)
    // do not (sync) rebind immediately, it's faster than the async timer
    setTimeout(() => timer.rebind(null, 'hello').reset(0))
  })
})
