import React, { ComponentType, PureComponent, ReactNode } from 'react'
import update, { Spec } from 'immutability-helper'
import { Props } from '../Components/DateTimeRangePickerControlled'
import { Options } from '../Context/contextOptions'
import { ContextActions, ContextState } from '../Context/Context'
import * as DateTime from '../Helper/DateTime'

export interface Controller<P extends BaseControllerProps = BaseControllerProps>
{
    (DateRangePicker: ComponentType<Props>): ComponentType<P>
}

export interface BaseControllerProps
{
    children: ReactNode
    initialState?: Partial<ContextState>
    options?: Options
}

function getInitialState({ month, ...state }: Partial<ContextState> = {}): ContextState
{
    return Object.assign({
        month: DateTime.getFirstDayOfMonth(month || new Date()),
        start: null,
        end: null,
        open: false,
        hovered: null
    }, state)
}

type S = ContextState

export abstract class BaseController<P extends BaseControllerProps = BaseControllerProps> extends PureComponent<P, S>
{
    private readonly Component: ComponentType<Props>
    protected actions: ContextActions
    public state: S

    protected constructor(props, WrappedComponent: ComponentType<Props>)
    {
        super(props)
        this.state = getInitialState(props.initialState)
        this.Component = WrappedComponent
    }

    protected updateState(updateSpec: (state: Readonly<S>) => Spec<S>): Promise<S>
    {
        return new Promise(resolve => this.setState(
            state => update(state, updateSpec(state)),
            () => resolve(this.state)
        ))
    }

    protected toggle = (): Promise<S> =>
    {
        return this.updateState(({ open }): Spec<S> => ({ open: { $set: ! open } }) as Spec<S>)
    }

    protected setMonth = (date: Date): Promise<S> =>
    {
        return this.updateState(() => ({ month: { $set: date } }) as Spec<S>)
    }

    protected hoverDate = (date: Date): Promise<S> =>
    {
        return this.updateState(() => ({ hovered: { $set: date } }) as Spec<S>)
    }

    protected leaveDate = (date: Date): Promise<S> =>
    {
        return this.updateState(({ hovered }) => {
            // don't update state if the hovered date changed in the meantime
            if (hovered !== date) {
                return {} as Spec<S>
            }

            return {
                hovered: {
                    $set: null
                }
            } as Spec<S>
        })
    }

    public render(): ReactNode
    {
        const DateTimeRangePicker = this.Component
        return (
            <DateTimeRangePicker
                state={ this.state }
                options={ this.props.options }
                actions={ this.actions }
            >
                { this.props.children }
            </DateTimeRangePicker>
        )
    }
}
