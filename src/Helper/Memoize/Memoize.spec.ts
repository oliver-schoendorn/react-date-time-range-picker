import { clone } from '../DateTime'
import { memoizeFunction, memoizeResponse } from './Memoize'

describe('Memoize', function () {
    const select = (a: any, b: any) => ({ a, b })

    describe('memoizeFunction', function () {
        it('should memoize calls and prevent multiple invocations', function () {
            const selectMock = jest.fn(select)
            const memoized = memoizeFunction(selectMock)

            expect(memoized(1, 2)).toEqual({ a: 1, b: 2 })
            expect(memoized(1, 2)).toBe(memoized(1, 2))
            expect(selectMock).toBeCalledTimes(1)
        })

        it('should shallow compare call arguments', function () {
            const args = [ { foo: 'bar' }, { baz: 'bar' } ]

            const selectMock = jest.fn(select)
            const memoized = memoizeFunction(selectMock)

            expect(memoized(args[0], args[1])).toBe(memoized(args[0], args[1]))
            expect(memoized(args[0], args[1])).not.toBe(memoized({ foo: 'bar' }, args[1]))
            expect(selectMock).toBeCalledTimes(2)
        })

        it('should handle date objects', function () {
            const selector = jest.fn(function(
                startDate?: Date,
                endDate?: Date
            ): null | [ Date, Date ]
            {
                if (! startDate || ! endDate) {
                    return null
                }

                return startDate < endDate
                    ? [ startDate, endDate ]
                    : [ endDate, startDate ]
            })
            const memoized = memoizeFunction(selector, { cacheSize: 3 })

            expect(memoized(null, null)).toBe(memoized(null, null))
            expect(selector).toBeCalledTimes(1)
        })
    })

    describe('memoizeResponse', function () {
        it('should memoize response objects', function () {
            const selectMock = jest.fn(select)
            const memoized = memoizeResponse(selectMock)

            expect(memoized({ foo: 'bar' }, true)).toBe(memoized({ foo: 'bar' }, true))
            expect(selectMock).toBeCalledTimes(2)
        })
    })
})