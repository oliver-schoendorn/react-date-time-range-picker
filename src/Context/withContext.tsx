import React, { Component, ReactNode, ComponentType } from 'react'
import deepEqual from 'deep-equal'
import { Context, DateTimeRangePickerContextConsumer } from './Context'
import shallowEqual from 'shallowequal'

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

    public shouldComponentUpdate(nextProps: Readonly<DateTimeRangePickerContextSelectorProps<P, S>>): boolean
    {
        // This used to perform a deep equal check, but this caused some issues when switching locales (infinite loop)
        // This is most likely caused by comparing react nodes. Since I do not see a simple way to work around this,
        // only a shallow equal is performed. The performance implications should not be noticeable.
        if (! shallowEqual(this.props.props, nextProps.props)) {
            return true
        }

        const currSelectedContext = this.selector(this.props.context, this.props.props)
        const nextSelectedContext = this.selector(nextProps.context, nextProps.props)

        // Shotgun fix: Just in case that infinite loop issue occurs here as well, we will catch the error and tell
        // the component to update.
        try {
            if (! deepEqual(currSelectedContext, nextSelectedContext)) {
                return true
            }
        }
        catch {
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
