import { createContext, RefObject } from 'react'
import { makeContextOptions, Options } from './contextOptions'

export interface ContextState
{
    open: boolean
    month: Date | null
    start: Date | null
    prevStart: Date | null
    end: Date | null
    prevEnd: Date | null
    hovered: Date | null
}

const defaultState: ContextState = {
    open: false,
    month: null,
    start: null,
    prevStart: null,
    end: null,
    prevEnd: null,
    hovered: null
}

export interface ContextActions
{
    toggle(): void
    setMonth(date: Date): void
    hoverDate(date: Date): void
    leaveDate(date: Date): void
    clickDate(date: Date): void
    selectDate(startDate: Date, endDate?: Date): void
    cancel(): void
    apply(): void
}

export interface Context
{
    state: ContextState
    actions: ContextActions
    options: Required<Options>
    relativeRef: RefObject<HTMLElement> | null
}

export function makeContext(
    state: ContextState = null,
    handlers: ContextActions = null,
    options: Options = {},
    ref?: RefObject<HTMLElement>
): Context
{
    return {
        state: Object.assign(defaultState, state || {}),
        actions: handlers,
        options: makeContextOptions(options),
        relativeRef: ref
    }
}

export const {
    Provider: DateTimeRangePickerContextProvider,
    Consumer: DateTimeRangePickerContextConsumer
} = createContext<Context>(makeContext())
