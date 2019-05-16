import React, { Component, ReactNode, ComponentType } from 'react'
import deepEqual from 'deep-equal'
import { Context, DateTimeRangePickerContextConsumer } from './Context'

type Selector<P, S extends object> = (context: Context, props: P) => S
type SelectorFactory<P, S extends object> = () => Selector<P, S>

export function withContext<S extends object, P = {}>(selector: Selector<P, S> | SelectorFactory<P, S>)
{
    return (Component: ComponentType<P>): ComponentType<Exclude<P, keyof S>> => (props: P) => (
        <DateTimeRangePickerContextConsumer>
            { (context) => (
                <DateTimeRangePickerContextSelector
                    props={ props }
                    context={ context }
                    selector={ selector }
                    Component={ Component }
                />
            ) }
        </DateTimeRangePickerContextConsumer>
    )
}

interface DateTimeRangePickerContextSelectorProps<P, S extends object>
{
    Component: ComponentType<P>
    props: P
    context: Context
    selector: Selector<P, S> | SelectorFactory<P, S>
}

class DateTimeRangePickerContextSelector<P, S extends object> extends
    Component<DateTimeRangePickerContextSelectorProps<P, S>>
{
    private readonly selector: Selector<P, S>

    constructor(props: DateTimeRangePickerContextSelectorProps<P, S>)
    {
        super(props)

        const state: Selector<P, S> | S = props.selector(props.context, props.props)
        this.selector = typeof state === 'function'
            ? state as Selector<P, S>
            : props.selector as Selector<P, S>
    }

    public shouldComponentUpdate(
        nextProps: Readonly<DateTimeRangePickerContextSelectorProps<P, S>>,
        nextState: Readonly<{}>
    ): boolean
    {
        if (! deepEqual(this.props.props, nextProps.props)) {
            return true
        }

        const currSelectedContext = this.selector(this.props.context, this.props.props)
        const nextSelectedContext = this.selector(nextProps.context, nextProps.props)

        if (! deepEqual(currSelectedContext, nextSelectedContext)) {
            return true
        }

        return false
    }

    public render(): ReactNode
    {
        const { Component, props, context } = this.props
        const selectedContext = this.selector(context, props)

        return (
            <Component { ...props } { ...selectedContext} />
        )
    }
}
