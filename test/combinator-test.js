const chai = require('chai')
const reqesm = require('esm')(module)

const sut = reqesm('../src/combinators')

const {assert} = chai

const failObj = (match, stream) => ({isFail: true, match, stream})

describe('Test combinators', () => {
    it('anyChar matches', () => {
        const res = sut.anyChar(' ')
        assert.equal(' ', res.match)
        assert.equal('', res.stream)
    })

    it('anyChar fails on no input', () => {
        const res = sut.anyChar('')
        assert.deepEqual(failObj('', ''), res)
    })

    it('char matches correctly', () => {
        const res = sut.char('a')('asd')
        assert.equal('a', res.match)
        assert.equal('sd', res.stream)
    })

    it('char fails on invalid input', () => {
        const res = sut.char('a')('xyz')
        assert.deepEqual(failObj('', 'xyz'), res)
    })

    it('charTest matches correctly', () => {
        const res = sut.charTest(c => c === 'x' || c === 'y')('yfz')
        assert.equal('y', res.match)
        assert.equal('fz', res.stream)
    })

    it('charTest fails on invalid input', () => {
        const res = sut.charTest(c => c === 'x' || c === 'y')('aaa')
        assert.deepEqual(failObj('', 'aaa'), res)
    })

    it('word matches correctly', () => {
        const res = sut.word('asd')('asd')
        assert.equal('asd', res.match)
        assert.equal('', res.stream)
    })

    it('word fails on invalid input', () => {
        const res = sut.word('asd')('xyz')
        assert.deepEqual(failObj('', 'xyz'), res)
    })

    it('oneOf matches correctly', () => {
        const res = sut.oneOf(sut.char('a'), sut.char('x'))('xfe')
        assert.equal('x', res.match)
        assert.equal('fe', res.stream)
    })

    it('oneOf fails on invalid input', () => {
        const res = sut.oneOf(sut.char('a'), sut.char('x'))('bcd')
        assert.deepEqual(failObj('', 'bcd'), res)
    })


})
