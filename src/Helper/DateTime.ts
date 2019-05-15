export function fromUTC(
    utcYear: number,
    utcMonth: number,
    utcDate: number,
    utcHours: number = 0,
    utcMinutes: number = 0,
    utcSeconds: number = 0,
    utcMs: number = 0
)
{
    const date = new Date()
    date.setUTCFullYear(utcYear, utcMonth, utcDate)
    date.setUTCHours(utcHours, utcMinutes, utcSeconds, utcMs)
    return date
}

export function clone(date: Date): Date
{
    return new Date(date.getTime())
}

export function isDate(...dates: any[]): boolean
{
    for (const date of dates) {
        if (! (date instanceof Date)) {
            return false
        }
    }

    return true
}

export function getFirstDayOfMonth(date: Date): Date
{
    return fromUTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
}

export function getLastDayOfMonth(date: Date): Date
{
    return fromUTC(date.getUTCFullYear(), date.getUTCMonth()+1, 0)
}

export function getFirstDayOfWeek(date: Date, firstDayOfWeek: number = 1): Date
{
    const currentDayOfWeek = date.getDay()
    const offsetInDays = currentDayOfWeek >= firstDayOfWeek
        ? currentDayOfWeek - firstDayOfWeek
        : 7 - (firstDayOfWeek - currentDayOfWeek)
    const offsetInMs = 1000 * 60 * 60 * 24 * offsetInDays

    return new Date(date.valueOf() - offsetInMs)
}

export function getWeekNumber(date: Date): number
{
    const clonedDate = clone(date)

    // ISO week date weeks start on Monday, so correct the day number
    const nDay = (clonedDate.getDay() + 6) % 7

    // ISO 8601 states that week 1 is the week with the first Thursday of that year
    // Set the target date to the Thursday in the target week
    clonedDate.setDate(clonedDate.getDate() - nDay + 3)

    // Store the millisecond value of the target date
    const n1stThursday = clonedDate.valueOf()

    // Set the target to the first Thursday of the year
    // First, set the target to January 1st
    clonedDate.setMonth(0, 1)

    // Not a Thursday? Correct the date to the next Thursday
    if (clonedDate.getDay() !== 4) {
        clonedDate.setMonth(0, 1 + ((4 - clonedDate.getDay()) + 7) % 7)
    }

    // The week number is the number of weeks between the first Thursday of the year
    // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
    return 1 + Math.ceil((n1stThursday - clonedDate.valueOf()) / 604800000)
}

export function addDays(date: Date, days: number): Date
{
    return new Date(date.valueOf() + 86400000 * days)
}

export function addWeeks(date: Date, weeks: number): Date
{
    return new Date(date.valueOf() + 604800000 * weeks)
}

export function addMonths(date: Date, months: number): Date
{
    // get parts of the date
    const day = date.getUTCDate()
    const month = date.getUTCMonth()

    const nextDate = clone(date)

    // Set day to the first of the month to prevent shifting months by more than the given amount
    // otherwise adding a month to the 31-01-2019 would result in the 01-03-2019
    nextDate.setUTCDate(1)
    nextDate.setUTCMonth(month + months)
    nextDate.setUTCDate(Math.min(day, getDaysInMonth(nextDate)))

    return nextDate
}

export function getDaysInMonth(date: Date): number
{
    return getLastDayOfMonth(date).getDate()
}

export function withTime(date: Date, time: Date): Date
export function withTime(date: Date, hours?: number, minutes?: number, seconds?: number, ms?: number): Date
export function withTime(date: Date, hoursOrTime: number | Date = 0, minutes: number = 0, seconds: number = 0, ms: number = 0): Date
{
    if (hoursOrTime instanceof Date) {
        return fromUTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            hoursOrTime.getUTCHours(),
            hoursOrTime.getUTCMinutes(),
            hoursOrTime.getUTCSeconds(),
            hoursOrTime.getUTCMilliseconds()
        )
    }

    const cloned = clone(date)
    cloned.setUTCHours(
        hoursOrTime,
        minutes,
        seconds,
        ms
    )
    return cloned
}

export function dateEquals(dateA: Date | any, dateB: Date | any): boolean
{
    if (! isDate(dateA, dateB)) {
        return false
    }

    return withTime(dateB, dateA).valueOf() === dateA.valueOf()
}

export function isToday(date: Date): boolean
{
    return dateEquals(new Date(), date)
}

export function dateBetween(date: Date, startDate?: Date, endDate?: Date): boolean
{
    if (! isDate(date, startDate, endDate)) {
        return false
    }

    const start = withTime(min(startDate, endDate), date)
    const end = withTime(max(startDate, endDate), date)

    return start <= date && date <= end
}

export function min(...dates: Date[]): Date
export function min(...dates: any[]): Date | false
{
    const actualDates = dates.filter(date => isDate(date))
        .map(date => date.valueOf())

    if (actualDates.length === 0) {
        return false
    }

    return new Date(Math.min(...actualDates))
}

export function max(...dates: Date[]): Date
export function max(...dates: any[]): Date | false
{
    const actualDates = dates.filter(date => isDate(date))
        .map(date => date.valueOf())

    if (actualDates.length === 0) {
        return false
    }

    return new Date(Math.max(...actualDates))
}
