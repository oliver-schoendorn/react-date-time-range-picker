import React from 'react'
import { BaseController, BaseControllerProps, Controller } from './Controller'

export interface Props extends BaseControllerProps
{
    onChange(date: Date): any
}

const withController: Controller<Props> = (DateRangePicker) => class WithRangeController extends BaseController<Props>
{
    constructor(props)
    {
        super(props, DateRangePicker)
        this.actions = {
            toggle: this.toggle,
            setMonth: this.setMonth,
            hoverDate: this.hoverDate,
            leaveDate: this.leaveDate,
            clickDate: this.clickDate,
            selectDate: this.selectDate
        }
    }

    private selectDate = (startDate: Date): void =>
    {
        this.updateState(() => ({
            start: { $set: startDate },
            end: { $set: startDate }
        })).then(state => this.props.onChange(state.start))
    }

    private clickDate = (date: Date): void =>
    {
        this.updateState(({ start }) => {
            if (start && start === date) {
                return {
                    start: { $set: null },
                    end: { $set: null },
                }
            }

            return {
                start: { $set: date },
                end: { $set: date }
            }
        }).then(state => this.props.onChange(state.start))
    }
}

export { withController }
