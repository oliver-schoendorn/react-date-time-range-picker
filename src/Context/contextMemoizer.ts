import { memoizeFunction, memoizeResponse } from '../Helper/Memoize/Memoize'
import { Options, makeContextOptions } from './contextOptions'
import {
    ContextActions,
    Context,
    ContextState
} from './Context'
import { RefObject } from 'react'


export type ContextCreator = (
    state: ContextState,
    options: Options,
    relativeRef: RefObject<HTMLElement>
) => Context

export function contextMemoizer(actions: ContextActions): ContextCreator
{
    const optionsMemoizer = memoizeFunction(makeContextOptions)

    return memoizeResponse((state, options: Options, relativeRef: RefObject<HTMLElement>) => ({
        state,
        actions,
        options: optionsMemoizer(options),
        relativeRef
    }))
}
