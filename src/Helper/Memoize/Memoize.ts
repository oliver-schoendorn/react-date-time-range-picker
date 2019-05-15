import shallowEqual from 'shallowequal'
import deepEqual from 'deep-equal'
import { MemoizeCache } from './MemoizeCache'

type AnyFunction = (...args: any[]) => any

export type MemoizeComparator<C> = (a: C, b: C) => boolean

interface MemoizeOptions<C>
{
    memoizer?: MemoizeComparator<C>
    cacheSize?: number
}

export const MemoizeComparators = {
    shallowEqual,
    deepEqual
}

export function memoizeFunction<T extends AnyFunction>(fn: T, options?: MemoizeOptions<any[]>): T
{
    const opts = Object.assign({
        memoizer: shallowEqual,
        cacheSize: 1
    }, options || {})

    const cache = new MemoizeCache(opts.cacheSize, opts.memoizer)

    return ((...args: any[]) => {
        const cachedResult = cache.get(args)
        if (cachedResult !== undefined) {
            return cachedResult
        }

        const result = fn(...args)
        cache.set(args, result)
        return result
    }) as T
}

export function memoizeResponse<T extends AnyFunction>(fn: T, options?: MemoizeOptions<ReturnType<T>>): T
{
    const opts = Object.assign({
        memoizer: deepEqual,
        cacheSize: 1,
        logger: () => void 0
    }, options || {})

    const cache = new MemoizeCache(opts.cacheSize, opts.memoizer)

    return ((...args: any[]) => {
        const result = fn(...args)
        const cachedResult = cache.get(result)

        if (cachedResult) {
            return cachedResult
        }

        cache.set(result, result)
        return result
    }) as T
}