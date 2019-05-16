import { getWeekNumber } from '../Helper/DateTime'
import { memoizeFunction } from '../Helper/Memoize/Memoize'

type TranslateFn = (date: Date) => string

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
    position?: [ 'left' | 'center' | 'right', 'up' | 'down' ]

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
         * Time localization
         *
         * Expects a translate function returning the hours / minutes / seconds.
         * Defaults to a method return the time in the following format: "HH:MM:SS"
         */
        formatTime?(time: Date): string

        /**
         * If true, times will be displayed from 0:00 until 23:59; otherwise from 0:00 AM to 11:59 PM
         */
        timePicker24Hours?: boolean

        /**
         * Will be called to determine the week number
         * Defaults to a method returning ISO week numbers
         */
        getWeekNumber?(date: Date): number

        /**
         * Will be called to render the selection result
         * Defaults to a method returning `${Options.i18n.formatDate(start)} - ${Options.i18n.formatDate(end)}`
         * @see Options.i18n.formatDate
         */
        formatResult?(start?: Date, end?: Date): string
    }
}

const defaultDayClassName = () => null
const defaultFormatDate = (date: Date): string =>
    date.getUTCFullYear() +
    '/' + (date.getUTCMonth() + 1).toString(10).padStart(2, '0') +
    '/' + (date.getUTCDate()).toString(10).padStart(2, '0')

const defaultFormatTime = (time: Date): string =>
    time.getUTCHours().toString(10).padStart(2, '0') +
    ':' + time.getUTCMinutes().toString(10).padStart(2, '0') +
    ':' + time.getUTCSeconds().toString(10).padStart(2, '0')

function formatDateTime(
    dateTime: Date | null,
    formatDate: (date: Date) => string,
    formatTime?: (time: Date) => string
): string
{
    if (! dateTime) {
        return ''
    }

    return formatDate(dateTime) + (formatTime ? (' ' + formatTime(dateTime)) : '')
}

const defaultFormatResult = memoizeFunction(function defaultFormatResult(
    formatDate: (date: Date) => string,
    formatTime?: (time: Date) => string
)
{
    return function formatResult(start?: Date, end?: Date): string
    {
        if (! start && ! end) {
            return ''
        }

        if (start && end && start.valueOf() === end.valueOf()) {
            return formatDateTime(start, formatDate, formatTime)
        }

        return formatDateTime(start, formatDate, formatTime) +
            (end ? (' - ' + formatDateTime(end, formatDate, formatTime)) : '')
    }
})

export function makeContextOptions({ constraints, classNames, i18n, ...baseOptions }: Options = {},): Required<Options>
{
    const formatDate: (date: Date) => string =
        (i18n ? i18n.formatDate : null)
        || defaultFormatDate

    const formatTime: (time: Date) => string =
        (i18n ? i18n.formatTime : null)
        || defaultFormatTime

    const formatResult: (start?: Date, end?: Date) => string =
        (i18n ? i18n.formatResult : null)
        || defaultFormatResult(formatDate, (baseOptions && baseOptions.showTimePicker) ? formatTime : null)

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
            formatTime,
            timePicker24Hours: false,
            getWeekNumber,
            formatResult
        }, i18n || {})
    }, baseOptions || {})
}
