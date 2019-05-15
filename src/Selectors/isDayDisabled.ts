import { memoizeFunction } from '../Helper/Memoize/Memoize'

export const isDayDisabled = () => memoizeFunction(function isDayDisabled(day: Date, month: Date)
{
    return day.getMonth() !== month.getMonth() || day.getFullYear() !== month.getFullYear()
})
