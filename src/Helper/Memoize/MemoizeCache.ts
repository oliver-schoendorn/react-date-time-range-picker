import { MemoizeComparator } from './Memoize'

export class MemoizeCache<T = any, Key = any[]>
{
    private readonly size: number

    public readonly store: Array<[ Key, T ]>

    private readonly comparator: MemoizeComparator<Key>

    public constructor(size: number, comparator: MemoizeComparator<Key>)
    {
        this.size = size
        this.store = []
        this.comparator = comparator
    }

    public get(key: Key): T | undefined
    {
        const result = [ ...this.store ].reverse().find(value => {
            // console.log('Comparing', {
            //     expected: key,
            //     actual: value[0],
            //     equals: this.comparator(value[0], key)
            // })
            return this.comparator(value[0], key)
        })

        return result === undefined ? undefined : result[1]
    }

    public set(key: Key, value: T): void
    {
        this.store.push([ key, value ])

        if (this.store.length > this.size) {
            this.store.shift()
        }

    }
}
