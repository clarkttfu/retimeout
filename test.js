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


})