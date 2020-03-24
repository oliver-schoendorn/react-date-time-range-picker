import { Context } from '../Context/Context'
import { dateEquals, isDate, max, min } from '../Helper/DateTime'
import { memoizeFunction } from '../Helper/Memoize/Memoize'

const getSelectedRangeLabel = memoizeFunction(function getSelectedRangeLabel(
    startDate: Date | null,
    endDate: Date | null,
    ranges: Context['options']['ranges']
): string | 'custom' | null
{
    if (! ranges) {
        return null
    }

    if (! isDate(startDate, endDate)) {
        return 'custom'
    }

    const start = min(startDate, endDate)
    const end   = max(startDate, endDate)

    const rangeLabels = Object.entries(ranges)
    for (const [ rangeLabel, { from, until } ] of rangeLabels) {
        const rangeStart = min(from, until)
        const rangeEnd   = max(from, until)

        if (dateEquals(start, rangeStart) && dateEquals(end, rangeEnd)) {
            return rangeLabel
        }
    }

    return 'custom'
}, { cacheSize: 1 })

export function getSelectedRangeLabelSelector(): (
    (context: Context) => ReturnType<typeof getSelectedRangeLabel>
)
{
    return (({ state, options }) => getSelectedRangeLabel(state.start, state.end, options.ranges))
}
