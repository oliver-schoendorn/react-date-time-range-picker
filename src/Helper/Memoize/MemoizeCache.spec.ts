import { MemoizeComparators } from './Memoize'
import { MemoizeCache } from './MemoizeCache'

describe('Memoize Cache', function () {
    const examples = [
        [ [ 'foo', 'bar'], 'baz' ],
        [ [ 'baz', 'bar'], 'foo' ],
        [ [ 'baz', 'foo'], 'bar' ],
        [ [ 'foo', 'baz'], 'baf' ],
    ]

    it('should return stored values', function () {
        const cache = new MemoizeCache(examples.length, MemoizeComparators.shallowEqual)
        examples.forEach(([key, value]) => cache.set([ key ], value))

        examples.forEach(([key, value]) => {
            expect(cache.get([ key ])).toStrictEqual(value)
        })
    })

    it('should keep the given size', function () {
        const cache = new MemoizeCache(2, MemoizeComparators.shallowEqual)
        const exampleSubset = [ examples[0], examples[1], examples[2] ]
        exampleSubset.forEach(([key, value]) => cache.set([ key ], value))

        expect(cache.get([examples[0][0]])).toStrictEqual(undefined)
        expect(cache.get([examples[1][0]])).toStrictEqual(examples[1][1])
        expect(cache.get([examples[2][0]])).toStrictEqual(examples[2][1])

        cache.set([examples[3][0]], examples[3][1])

        expect(cache.get([examples[0][0]])).toStrictEqual(undefined)
        expect(cache.get([examples[1][0]])).toStrictEqual(undefined)
        expect(cache.get([examples[2][0]])).toStrictEqual(examples[2][1])
        expect(cache.get([examples[3][0]])).toStrictEqual(examples[3][1])
    })
})