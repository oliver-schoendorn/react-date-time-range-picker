import { Context } from '../Context/Context'

export type GetNameOfWeekDay = (month: Date) => string
export function getNameOfWeekDay(context: Context): GetNameOfWeekDay
{
    if (typeof context.options.i18n.weekdays === 'function') {
        return context.options.i18n.weekdays
    }

    return function getNameOfWeekDay(month: Date): string {
        return context.options.i18n.weekdays[month.getUTCDay()]
    }
}
