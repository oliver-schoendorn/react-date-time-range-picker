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
            clickDate: this.selectDate,
            selectDate: this.selectDate,
            cancel: this.cancel,
            apply: () => this.apply().then(({ start }) => this.props.onChange(start))
        }
    }

    private selectDate = (startDate: Date): void =>
    {
        this.updateState(({ start, end }) => ({
            start: { $set: startDate },
            end: { $set: startDate },
            prevStart: { $set: start },
            prevEnd: { $set: end }
        })).then(this.onUpdateDate)
    }

    private onUpdateDate = () =>
    {
        const { options } = this.props
        if (options.autoApply && ! options.showTimePicker) {
            this.actions.apply()
        }
    }
}

export { withController }
