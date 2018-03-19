const Events = require('events')
const should = require('should')
const mock = require('mock-require')

const emitter = new Events()
mock('process', emitter)

const retimeout = require('./index.js')

describe('Test cases', () => {

  it('should finish in 50ms', done => {
    var delay = 50
    var start = Date.now()
    retimeout(() => {
      should(Date.now() - start).greaterThanOrEqual(delay)
      done()
    }).reset(delay)
  })

  it('should not call until reset', done => {
    var start = Date.now()
    var resettable = retimeout(() => {
      if (Date.now() - start < 30) done('should not call')
      done()
    }).reset(30)
  })

  it('trigger on process exit', done => {
    retimeout(done).triggerOn('beforeExit')
    emitter.emit('beforeExit')
  })

  it('trigger on target events', done => {
    var counter = 0
    retimeout(() => {
      if (++counter === 3) done()
    }).triggerOn(emitter, 'event1', 'event2').triggerOn(emitter, 'event3')
    emitter.emit('event2')
    emitter.emit('event1')
    emitter.emit('event3')
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

  it('do without clearing the timer', done => {
    var counter = 0
    var resettable = retimeout(() => ++counter)
    resettable.reset(50).do(false)
    setTimeout(() => {
      should(counter).equal(2)
      done()
    }, 60)
  })

  it('do and clear the timer', done => {
    var counter = 0
    var resettable = retimeout(() => ++counter)
    resettable.reset(50).do()
    setTimeout(() => {
      should(counter).equal(1)
      done()
    }, 60)
  })

})