import { Context } from '../Context/Context'
import { Options } from '../Context/contextOptions'
import { dateBetween, dateEquals } from '../Helper/DateTime'
import { memoizeFunction } from '../Helper/Memoize/Memoize'

function isDaySelectableFn(
    day: Date,
    constraints: Context['options']['constraints'],
    selectedStartDate?: Date,
    selectedEndDate?: Date
): boolean
{
    if (dateEquals(day, selectedStartDate)) {
        return true
    }

    // has custom method
    if (constraints.isSelectable && constraints.isSelectable(day) !== true) {
        return false
    }

    // min date
    if (constraints.minDate && constraints.minDate > day) {
        return false
    }

    // max date
    if (constraints.maxDate && constraints.maxDate < day) {
        return false
    }

    // start date was selected => disable all dates that are outside of the maxSpan
    if (constraints.maxSpan && selectedStartDate && ! selectedEndDate) {
        const minDate = new Date(selectedStartDate.valueOf() - constraints.maxSpan)
        const maxDate = new Date(selectedStartDate.valueOf() + constraints.maxSpan)

        if (! dateBetween(day, minDate, maxDate)) {
            return false
        }
    }

    // start date was selected => disable all dates that are inside of the minSpan
    if (constraints.minSpan && selectedStartDate && ! selectedEndDate) {
        const minDate = new Date(selectedStartDate.valueOf() - constraints.minSpan)
        const maxDate = new Date(selectedStartDate.valueOf() + constraints.minSpan)

        if (dateBetween(day, minDate, maxDate)) {
            return false
        }
    }

    return true
}

export const isDaySelectable = () =>
{
    const isSelectable = memoizeFunction(isDaySelectableFn)

    return (
        constraints: Required<Options>['constraints'],
        state: { start: Date, end: Date },
        date: Date
    ): boolean =>
    {
        return isSelectable(
            date,
            constraints,
            state.start,
            state.end
        )
    }
}

