const should = require('should')

const retimeout = require('./index.js')

describe('Test cases', () => {

  it('should finish in 50ms', done => {
    var delay = 50
    var start = Date.now()
    var resettable = retimeout(() => {
      should(Date.now() - start).greaterThanOrEqual(delay)
      done()
    }).reset(delay)
  })

  it('should not call until reset', done => {
    var start = Date.now()
    var resettable = retimeout(() => {
      if (Date.now() - start < 30) done('should not call')
      done()
    })
    resettable.reset(30)
  })

  it('reset and finish around 20ms', done => {
    var start = Date.now()
    var resettable = retimeout(() => {
      should(Date.now() - start).greaterThanOrEqual(20)
      done()
    }).reset(50)
    setTimeout(() => resettable.reset(10), 10)
  })

  it('clear successfully', done => {
    var resettable = retimeout(() => done('should not call'))
    resettable.reset(20).clear()
    setTimeout(() => done(), 30)
  })

  it('do successfully', done => {
    var resettable = retimeout(() => done())
    resettable.reset(2005).do()
  })

  it('release successfully', () => {
    const foo = () => {}
    var resettable = retimeout(this, foo, 1, 2).reset()
    should(resettable._binding).equal(this)
    should(resettable._fn).equal(foo)
    should(resettable._args[1]).equal(2)
    should(resettable._args[0]).equal(1)
    should(resettable._timeout).be.not.null()
    var timeout = resettable.release()
    should(resettable._binding).be.null()
    should(resettable._fn).be.null()
    should(resettable._args).be.null()
    should(resettable._timeout).be.null()
    should(typeof(timeout.ref) == 'function').be.true()
  })

})