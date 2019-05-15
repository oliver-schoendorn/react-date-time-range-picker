import * as DateTime from '../Helper/DateTime'

export function isDayEndOfSelection(
    day: Date,
    start?: Date,
    end?: Date,
    hovered?: Date
): boolean
{
    return DateTime.dateEquals(day, DateTime.max(start, end || hovered)) || false
}
