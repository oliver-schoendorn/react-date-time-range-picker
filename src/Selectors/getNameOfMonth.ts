import { Context } from '../Context/Context'

export type GetNameOfMonth = (month: Date) => string
export function getNameOfMonth({ options }: Context): GetNameOfMonth
{
    if (typeof options.i18n.formatMonthName === 'function') {
        return options.i18n.formatMonthName
    }

    const getMonthLabel = typeof options.i18n.months === 'function'
        ? options.i18n.months
        : (month: Date): string => options.i18n.months[month.getUTCMonth()]

    return function getNameOfMonth(month: Date): string {
        return getMonthLabel(month) + ' ' + month.getUTCFullYear()
    }
}
