import React from 'react'
import { BaseController, BaseControllerProps, Controller } from './Controller'
import * as DateTime from '../Helper/DateTime'

export interface Props extends BaseControllerProps
{
    onChange(start: Date, end: Date): any
}

const withRangeController: Controller<Props> = (DateRangePicker) =>
    class WithRangeController extends BaseController<Props>
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

        private selectDate = (startDate: Date, endDate?: Date): void =>
        {
            this.updateState(state => ({
                start: { $set: startDate },
                end: { $set: endDate || state.end }
            })).then(state => this.props.onChange(state.start, state.end))
        }

        private clickDate = (date: Date): void =>
        {
            this.updateState(({ start, end }) => {
                if (start && ! end) {
                    // Clear selection if the start date was selected twice
                    if (start && DateTime.dateEquals(start, date)) {
                        return { start: { $set: null } }
                    }

                    return {
                        start: { $set: DateTime.min(date, start) as Date },
                        end: { $set: DateTime.max(date, start) as Date }
                    }
                }

                return {
                    start: { $set: date },
                    end: { $set: null }
                }
            }).then(state => {
                if (state.start && state.end) {
                    this.props.onChange(state.start, state.end)
                }
            })
        }
    }

export { withRangeController }
