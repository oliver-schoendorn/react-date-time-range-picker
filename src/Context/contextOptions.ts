import { getWeekNumber, withTime } from '../Helper/DateTime'
import { isDaySelectable } from '../Selectors/isDaySelectable'
import { Context } from './Context'
import { RefObject } from 'react';

export type TranslateFn = (date: Date) => string

/**
 * The overlay ref references the overlay which is usually absolute positioned
 * The relative ref will reference the wrapped children of the date time picker (a button or similar)
 */
export type PositioningCallback = (overlayRef: RefObject<HTMLDivElement>, relativeRef: RefObject<HTMLElement>) => void

export interface Options
{
    /**
     * Allows setting limitations to the selectable dates
     */
    constraints?: {
        /**
         * The earliest selectable Date
         * Default: null (no limitation)
         */
        minDate?: null | Date

        /**
         * The latest selectable Date
         * Default: null (no limitation)
         */
        maxDate?: null | Date

        /**
         * The maximum date span that can be selected (in seconds)
         * Default: null (infinite)
         */
        maxSpan?: null | number

        /**
         * The minimum date span that can be selected (in seconds)
         * Default: 1 Day
         */
        minSpan?: number

        /**
         * The minimum time span that can be selected (in seconds)
         */
        timeInterval?: number

        /**
         * Conditionally disable or enable days from being selected
         */
        isSelectable?(date: Date): boolean | null
    }

    /**
     * Automatically apply changed date, if an start and end date have been selected
     * NOTE: If Options.showTimePicker is set to true, this option will be ignored
     */
    autoApply?: boolean

    /**
     * If set to true, only a single calendar will be rendered
     * Default: false
     */
    showSingleCalendar?: boolean

    /**
     * Shows a time picker below the calendars
     *
     * Whether seconds, minutes or minutes / seconds in a specific interval will be selectable will be determined by
     * @see Options.constraints.timeInterval option.
     *
     * Default: false
     */
    showTimePicker?: boolean

    /**
     * Show the week number in the calendars
     *
     * Shows ISO week numbers by default. If you want to show gregorian week numbers for instance,
     * @see Options.i18n.getWeekNumber
     */
    showWeekNumber?: boolean

    /**
     * The position where the overlay will be placed
     */
    position?: [ 'left' | 'center' | 'right', 'up' | 'down' ] | PositioningCallback

    /**
     * Customize class names
     */
    classNames?: {
        /**
         * Adds a class name to the wrapping component
         */
        wrapper?: string

        /**
         * Adds a class name to the calendar overlay
         */
        overlay?: string

        /**
         * Adds a class name to the calendars
         */
        calendar?: string

        /**
         * Adds a class name to the submit button
         */
        submitButton?: string

        /**
         * Adds a class name to the cancel button
         */
        cancelButton?: string

        /**
         * Adds a class name to a specific day
         */
        day?: string | ((date: Date) => string | null)
    }

    /**
     * Predefined date ranges that will be shown to the left of the calendar
     */
    ranges?: {
        [label: string]: {
            from: Date
            until: Date
        }
    }

    /**
     * Determines the start date that is being selected if the custom range was selected.
     * Default: The system tries to find a date that is as close as possible to the current date.
     *    NOTE: If no date can be determined, the click on the custom range will be ignored.
     */
    customRangeStartDate?: Date | ((context: Context) => Date)

    /**
     * Internationalization options
     */
    i18n?: {
        /**
         * Translations
         */
        labels?: {
            apply?: string
            cancel?: string
            customRange?: string
        }

        /**
         * 0 = sunday, 1 = monday, etc.
         * Default: 1
         */
        firstDayOfWeek?: number

        /**
         * Weekday localization
         * Expects either a translate function or an array with all week day names (starting from sunday)
         */
        weekdays?: TranslateFn | string[]

        /**
         * Month localization
         * Expects either a translate function or an array with all month names (starting from January)
         */
        months?: TranslateFn | string[]

        /**
         * Expects a translate function that returns the name of the month and the year
         * Defaults to a method that picks the month name from this options and appends
         * the full year.
         *
         * @see Options.i18n.months
         */
        formatMonthName?(date: Date): string

        /**
         * Date localization
         *
         * Expects a translate function that returns the day, month and year.
         * Defaults to a method returning the date in the following format: "dd/mm/YYYY"
         */
        formatDate?(date: Date): string

        /**
         * If true, times will be displayed from 0:00 until 23:59; otherwise from 0:00 AM to 11:59 PM
         */
        timePicker24Hours?: boolean

        /**
         * A string that will be displayed in the footer between two selected dates
         */
        resultRangeSeparator?: string

        /**
         * Will be called to determine the week number
         * Defaults to a method returning ISO week numbers
         */
        getWeekNumber?(date: Date): number
    }
}

const defaultDayClassName = () => null
const defaultFormatDate = (date: Date): string =>
    date.getUTCFullYear() +
    '/' + (date.getUTCMonth() + 1).toString(10).padStart(2, '0') +
    '/' + (date.getUTCDate()).toString(10).padStart(2, '0')

const makeDefaultCustomRangeStartDate = () =>
{
    const isSelectable = isDaySelectable()
    return (ctx: Context): Date =>
    {
        const now = ctx.options.showTimePicker
            ? new Date()
            : withTime(new Date()) // Set time to 00:00:00 if time picker is disabled

        if (isSelectable(ctx.options.constraints, ctx.state, now)) {
            return now
        }

        const closestLimit = now > ctx.options.constraints.minDate
            ? ctx.options.constraints.minDate
            : ctx.options.constraints.maxDate

        return isSelectable(ctx.options.constraints, ctx.state, closestLimit) ? closestLimit : null
    }
}

export function makeContextOptions({ constraints, classNames, i18n, ...baseOptions }: Options = {},): Required<Options>
{
    const formatDate: (date: Date) => string =
        (i18n ? i18n.formatDate : null)
        || defaultFormatDate

    const customRangeStartDate = baseOptions.customRangeStartDate || makeDefaultCustomRangeStartDate()

    return Object.assign({
        constraints: Object.assign({
            minDate: null,
            maxDate: null,
            maxSpan: null,
            minSpan: 60 * 60 * 24,
            timeInterval: 60,
            isSelectable: null
        }, constraints || {}),

        autoApply: false,
        showSingleCalendar: false,
        showTimePicker: false,
        showWeekNumber: false,
        showIsoWeekNumber: false,
        position: baseOptions && baseOptions.position
            ? baseOptions.position
            : [ 'right', 'down' ],

        classNames: Object.assign({
            wrapper: '',
            overlay: '',
            calendar: '',
            submitButton: '',
            cancelButton: '',
            day: defaultDayClassName
        }, classNames || {}),

        ranges: null,
        customRangeStartDate,

        i18n: Object.assign({
            labels: {
                apply: 'apply',
                cancel: 'cancel',
                customRange: 'Custom'
            },
            firstDayOfWeek: 1,
            weekdays: [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
            months: [
                'January',
                'February',
                'March',
                'April',
                'Mai',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            formatDate,
            resultRangeSeparator: ' - ',
            timePicker24Hours: false,
            getWeekNumber
        }, i18n || {})
    }, baseOptions || {})
}
