import React, { FunctionComponent, ReactNodeArray } from 'react'
import { withContext } from '../../Context/withContext'
import { getNameOfWeekDay } from '../../Selectors/getNameOfWeekDay'
import { classNames } from '../../Helper/classNames'
import * as DateTime from '../../Helper/DateTime'
import { Week } from './Week'

interface Props
{
    month: Date
}

interface ContextProps
{
    firstDayOfWeek: number
    showWeekNumber: boolean
    getNameOfWeekDay: (date: Date) => string
}

const CalendarComponent: FunctionComponent<Props & ContextProps> =
    ({ month, firstDayOfWeek, getNameOfWeekDay, showWeekNumber }) =>
{
    const firstDayOfMonth = DateTime.getFirstDayOfMonth(month)
    const firstDay = DateTime.getFirstDayOfWeek(firstDayOfMonth, firstDayOfWeek)

    const weekDays: ReactNodeArray = []
    if (showWeekNumber) {
        weekDays.push(<th key='week-number' className={ classNames('-week-day-label') }>W</th>)
    }

    for (let i = 0; i < 7; ++i) {
        const day = DateTime.addDays(firstDay, i)
        weekDays.push(
            <th key={ day.getUTCDay() } className={ classNames('-week-day-label') }>{ getNameOfWeekDay(day) }</th>
        )
    }

    const weeks: ReactNodeArray = []
    for (let i = 0; i < 6; ++i) {
        const week = DateTime.addWeeks(firstDay, i)
        weeks.push(
            <Week key={ week.valueOf() } firstDay={ week } month={ month }/>
        )
    }

    return (
        <table className={ classNames('table table-sm', '-month') }>
            <thead>
            <tr className={ classNames('-week') }>
                { weekDays }
            </tr>
            </thead>
            <tbody>
            { weeks }
            </tbody>
        </table>
    )
}

const Month = withContext<ContextProps, Props>(context => ({
    firstDayOfWeek: context.options.i18n.firstDayOfWeek,
    getNameOfWeekDay: getNameOfWeekDay(context),
    showWeekNumber: context.options.showWeekNumber
}))(CalendarComponent)

export { Month }
