import * as DateTime from '../Helper/DateTime'

export function isDayStartOfSelection(day: Date, start?: Date, end?: Date, hovered?: Date): boolean
{
    return DateTime.dateEquals(day, DateTime.min(start, end || hovered)) || false
}
