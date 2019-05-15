import React, { FunctionComponent, ReactNodeArray } from 'react'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import * as DateTime from '../../Helper/DateTime'
import { Day } from './Day'

interface Props
{
    firstDay: Date
    month: Date
}

interface ContextProps
{
    showWeekNumber: boolean
    getWeekNumber: (date: Date) => number
}

const WeekComponent: FunctionComponent<Props & ContextProps> = ({ firstDay, month, showWeekNumber, getWeekNumber }) =>
{
    const weekDayComponents: ReactNodeArray = []
    for (let i = 0; i < 7; ++i) {
        const currentDay = DateTime.addDays(firstDay, i)
        weekDayComponents.push(
            <Day key={ currentDay.valueOf() } day={ currentDay } month={ month } />
        )
    }

    return (
        <tr className='week'>
            { showWeekNumber && (
                <td className={ classNames('-week-day-label', 'week-number') }>{ getWeekNumber(firstDay) }</td>
            ) }
            { weekDayComponents }
        </tr>
    )
}

const Week = withContext<ContextProps, Props>(context => ({
    showWeekNumber: context.options.showWeekNumber,
    getWeekNumber: context.options.i18n.getWeekNumber
}))(WeekComponent)

export { Week }
