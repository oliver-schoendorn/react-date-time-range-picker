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
                selectDate: this.selectDate,
                cancel: this.cancel,
                apply: () => this.apply().then(({ start, end }) => this.props.onChange(start, end))
            }
        }

        private selectDate = (startDate: Date, endDate?: Date): void =>
        {
            this.updateState(state => ({
                start: { $set: startDate },
                end: { $set: endDate || state.end }
            })).then(this.onUpdateDate)
        }

        private clickDate = (date: Date): void =>
        {
            this.updateState(({ start, end, prevStart, prevEnd }) => {
                if (start && ! end) {
                    // Clear selection if the start date was selected twice
                    if (start && DateTime.dateEquals(start, date)) {
                        return {
                            start: { $set: prevStart },
                            end: { $set: prevEnd }
                        }
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
            }).then(this.onUpdateDate)
        }

        private onUpdateDate = () =>
        {
            const { props: { options }, state } = this
            if (state.start && state.end && options.autoApply && ! options.showTimePicker) {
                this.actions.apply()
            }
        }
    }

export { withRangeController }
