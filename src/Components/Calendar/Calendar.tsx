import React, { FunctionComponent, MouseEvent } from 'react'
import { withContext } from '../../Context/withContext'
import { getNameOfMonth } from '../../Selectors/getNameOfMonth'
import { classNames } from '../../Helper/classNames'
import * as DateTime from '../../Helper/DateTime'
import { Month } from './Month'
import { Time } from '../Time/Time'

interface ExternalProps
{
    type: 'left' | 'right' | 'both'
}

interface ContextProps
{
    month: Date
    minDate: Date | null
    maxDate: Date | null
    calendarClassName: string | undefined
    showTimePicker: boolean
    setMonth(date: Date): void
    getNameOfMonth(date: Date): string
}

const getPrevMonth = (type: 'left' | 'right' | 'both', month: Date, minDate: Date | null): Date | null =>
{
    if (type === 'right') {
        return null
    }

    const refDate = DateTime.getLastDayOfMonth(type === 'left'
        ? DateTime.addMonths(month, -2)
        : DateTime.addMonths(month, -1))

    if (minDate && refDate < DateTime.withTime(minDate, refDate)) {
        return null
    }

    return DateTime.addMonths(month, -1)
}

const getNextMonth = (type: 'left' | 'right' | 'both', month: Date, maxDate: Date | null): Date | null =>
{
    if (type === 'left') {
        return null
    }

    const refDate = DateTime.addMonths(month, 1)

    if (maxDate && refDate > DateTime.withTime(maxDate, refDate)) {
        return null
    }

    return refDate
}

const getMonthToDisplay = (type: 'left' | 'right' | 'both', month: Date): Date =>
{
    switch (type) {
        case 'right':
        case 'both':
            return month
        case 'left':
            return DateTime.addMonths(month, -1)
    }
}

const setMonth = (month: Date, setMonth: (date: Date) => void) =>
{
    return function (event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()

        // Execute the setMonth slightly delayed to await the event bubbling (otherwise the click event
        // target might be unmounted before the click event reaches the document.onClick listener)
        setTimeout(() => setMonth(month), 0)
    }
}

const CalendarComponent: FunctionComponent<ExternalProps & ContextProps> = (props) =>
{
    // get the localized name of the calendar month
    const displayMonth = getMonthToDisplay(props.type, props.month)
    const displayMonthName = props.getNameOfMonth(displayMonth)

    // only show left arrow if the previous month is greater than the min date
    const prevMonth = getPrevMonth(props.type, props.month, props.minDate)
    const nextMonth = getNextMonth(props.type, props.month, props.maxDate)

    const calendarClassName = classNames('-calendar', props.calendarClassName, {
        left: !! prevMonth,
        right: !! nextMonth
    })

    return (
        <div className={ calendarClassName }>
            <div className='month-label'>
                { prevMonth && (
                    <a className='arrow left' href='#' onClick={ setMonth(prevMonth, props.setMonth) }>
                        <span/>
                    </a>
                ) }
                { displayMonthName }

                { nextMonth && (
                    <a className='arrow right' href='#' onClick={ setMonth(nextMonth, props.setMonth) }>
                        <span/>
                    </a>
                ) }
            </div>
            <Month month={ displayMonth }/>
            { props.showTimePicker && (
                <div className='time-pickers'>
                    <Time type={ props.type } />
                </div>
            ) }
        </div>
    )
}


const Calendar = withContext<ContextProps, ExternalProps>(context => ({
    month: context.state.month,
    minDate: context.options.constraints.minDate,
    maxDate: context.options.constraints.maxDate,
    calendarClassName: context.options.classNames.calendar,
    showTimePicker: context.options.showTimePicker,
    setMonth: context.actions.setMonth,
    getNameOfMonth: getNameOfMonth(context)
}))(CalendarComponent)

export { Calendar }
