
{assert} = require('chai')

{add} = require('../src/index')


describe('#add', ->
  it('2 + 2 = 4', ->
    assert.equal(add(2, 2), 4)
  )

  it('2 + (- 2) = 0', ->
    assert.equal(add(2, -2), 0)
  )

  it('2 + 0 = 2', ->
    assert.equal(add(2, 0), 2)
  )
)
