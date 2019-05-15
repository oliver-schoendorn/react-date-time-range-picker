import { Context } from '../Context/Context'
import { memoizeFunction } from '../Helper/Memoize/Memoize'

const getCurrentSelectionFromContext = memoizeFunction(function(
    startDate?: Date,
    endDate?: Date
): [ null, null ] | [ Date, Date ]
{
    console.count('getCurrentSelectionFromContext')

    if (! startDate || ! endDate) {
        return [ null, null ]
    }

    return startDate < endDate
        ? [ startDate, endDate ]
        : [ endDate, startDate ]
}, { cacheSize: 2 })
// A cache size of 2 is required because the "withContext" HOC will invoke the
// selector with the previous and next props

export function getCurrentSelection(context: Context): [ null, null ] | [ Date, Date ]
{
    const startDate = context.state.start
    const endDate = context.state.end || context.state.hovered

    return getCurrentSelectionFromContext(startDate, endDate)
}
