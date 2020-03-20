import React from 'react'
import { ContextState } from '../Context/Context'
import { Options } from '../Context/contextOptions'
import { dateEquals } from '../Helper/DateTime'
import { BaseController, BaseControllerProps, Controller } from './Controller'
import * as DateTime from '../Helper/DateTime'
import { Spec } from 'immutability-helper';

export interface Props extends BaseControllerProps
{
    onChange(start: Date | null, end: Date | null): any
    onUpdateSelection?(startDate: Date | null, endDate: Date | null)
}

type S = ContextState
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

        protected updateState(updateSpec: (state: Readonly<S>) => Spec<S>): Promise<S> {
            const prevState = {
                start: this.state.start,
                end:   this.state.end
            }

            return super.updateState(updateSpec).then(nextState => {
                if (! dateEquals(nextState.start, prevState.start) || ! dateEquals(nextState.end, prevState.end)) {
                    this.props.onUpdateSelection(nextState.start, nextState.end)
                }

                return nextState
            })
        }

        private selectDate = (startDate: Date | null, endDate?: Date): void =>
        {
            console.warn('WithRangeController::selectDate', { startDate, endDate })
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
            console.log('should apply changes?', { start: state.start, end: state.end, autoApply: options.autoApply })
            if (state.start && state.end && options.autoApply && ! options.showTimePicker) {
                this.actions.apply()
            }
        }
    }

export { withRangeController }
