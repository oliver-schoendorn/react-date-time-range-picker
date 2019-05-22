# React Date (Time) (Range) Picker

This is a date time range picker for React written in Typescript with internationalization in mind.
This package does not use any libraries for date time calculations, DOM manipulations or styling. The
compressed size of the javascript bundle is approximately 31KB (9.1KB gzipped).

This is heavily inspired by the
[Date Range Picker by Dan Grossman](https://github.com/dangrossman/daterangepicker). 

##### Table of Contents
1. [Installation](#installation)
2. [Basic usage (uncontrolled)](#basic-usage-uncontrolled)
   1. [Uncontrolled Date (Time) Range Picker](#uncontrolled-date-time-range-picker)
   2. [Uncontrolled Date (Time) Picker](#uncontrolled-date-time-picker)
   3. [Importing Stylesheets](#importing-stylesheets)
3. [Advanced usage (controlled)](#advanced-usage-controlled)
4. [Configuration](#configuration)
5. [License](#license)
   

## Installation

`npm i -D @oliver-schoendorn/react-date-time-range-picker`

## Basic usage (uncontrolled)

### Uncontrolled Date (Time) Range Picker

The uncontrolled picker manages the selection state automatically for you. All you need to do is 
passing it an `onChange` method and a child element. The child element will be wrapped and an onClick listener will
be attached to toggle the range picker overlay. 

```typescript jsx
import React, { PureComponent, ReactNode } from 'react'
import { DateTimeRangePicker } from '@oliver-schoendorn/react-date-time-range-picker'

interface State
{
    start: Date | null
    end: Date | null
}

export class Picker extends PureComponent<{}, State>
{
    public state: State = {
        start: null,
        end: null
    }
    
    private onChangDate = (start: Date | null, end: Date | null) => this.setState({ start, end })
    
    public render(): ReactNode
    {
        const { start, end } = this.state
        return (
            <div className='my-date-picker'>
                <div className='my-date-picker-selection'>
                    Your selection: { start && end
                        ? `${start.toISOString()} - ${end.toISOString()}`
                        : 'Please select a date range'
                    }                
                </div>
                
                <DateTimeRangePicker onChange={ this.onChangDate }>
                    <button>edit</button>
                </DateTimeRangePicker>
            </div>
        )
    }
}

```

### Uncontrolled Date (Time) Picker

The second variant is a date (time) picker only. It will only render one calendar by default.

```typescript jsx
import React, { PureComponent, ReactNode } from 'react'
import { DateTimePicker } from '@oliver-schoendorn/react-date-time-range-picker'

interface State
{
    date: Date | null
}

export class Picker extends PureComponent<{}, State>
{
    public state: State = { date: null }
    
    private onChangDate = (date: Date | null) => this.setState({ date })
    
    public render(): ReactNode
    {
        const { date } = this.state
        return (
            <div className='my-date-picker'>
                <div className='my-date-picker-selection'>
                    Your selection: { date ? date.toISOString() : 'Please select a date' }                
                </div>
                
                <DateTimePicker onChange={ this.onChangDate }>
                    <button>edit</button>
                </DateTimePicker>
            </div>
        )
    }
}

```

### Importing Stylesheets

If your project is using webpacks style-loader or similar, the simplest way to include the styles is to
`import '@oliver-schoendorn/react-date-time-range-picker/dist/cjs/date-time-range-picker.min.css'`.

Alternatively you could copy the `date-time-range-picker.min.css` file to your public folder and include it
in your header or where ever you would like to.

In case you are using SASS, you could also
`@import '~@oliver-schoendorn/react-date-time-range-picker/dist/esm/Styles/DateTimeRangePicker.scss` the styles.
This way you can overwrite a few [variables](./src/Styles/_Variables.scss) as well.

## Advanced usage (controlled)

For more advanced use cases, you have 2 options:

1. You can directly access the [`DateTimeRangePickerControlled`](./src/Components/DateTimeRangePickerControlled.tsx)
Component and implement the entire state management on your own. 

2. If you want to save yourself some time, you could also write an High-Order-Component that returns an Component that
extends the `DateTimeRangePickerController`. This is an abstract React Component that will come with predefined
State handlers which you could choose to overwrite or pass them directly to the
`DateTimeRangePickerControlled` Component. The [`DateTimeRangePicker`](./src/Controller/WithRangeController.tsx)
and the [`DateTimePicker`](./src/Controller/WithController.tsx) HOCs are two examples of how this can be done.

## Configuration

It tried to think of everything necessary to internationalize the date (time) (range) picker. The result is [this
humongous options interface](./src/Context/contextOptions.ts):

```typescript
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
```

You can pass your options object to all exported Picker Components.

**Note:** You should avoid mutating your options object or creating a new object on every rendering of your parent
Component as this will (probably) break the internal context memoization. 

```typescript jsx
import React from 'react'
import { DateTimeRangePicker, DateTimePickerOptions } from '@oliver-schoendorn/react-date-time-range-picker'

interface Props
{
  onChange(start: Date | null, end: Date | null): any
}

// Don't do this
export function badUsage(props: Props)
{
    const options: DateTimePickerOptions = {
        autoApply: true
    }
    
    return (
        <DateTimeRangePicker options={ options } onChange={ props.onChange }>
            <button>edit</button>
        </DateTimeRangePicker>
    )
}

// Do this
const options: DateTimePickerOptions = {
  autoApply: true
}
export function goodUsage(props: Props)
{
    return (
        <DateTimeRangePicker options={ options } onChange={ props.onChange }>
            <button>edit</button>
        </DateTimeRangePicker>
    )
}
```

## License

Copyright for portions of this project are held by
[Dan Grossman, 2012-2019](https://github.com/dangrossman/daterangepicker).
All other copyright are held by Oliver Schöndorn 2019.

The MIT License (MIT)

Copyright (c) 2012-2019 Dan Grossman
Copyright (c) 2019 Oliver Schöndorn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
