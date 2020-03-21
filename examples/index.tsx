import React, { FunctionComponent, ReactNode } from 'react';
import ReactDOM from 'react-dom'
import { withController } from '../src/Controller/WithController'
import { withRangeController } from '../src/Controller/WithRangeController'
import * as DateTime from '../src/Helper/DateTime'
import { Options } from '../src/Context/contextOptions'
import { DateTimeRangePickerControlled } from '../src'
import '../src/Styles/DateTimeRangePicker.scss'
import { ShowRangesOnlyUnlessCustomRangeIsSelected } from './ShowRangesOnlyUnlessCustomRangeIsSelected/ShowRangesOnlyUnlessCustomRangeIsSelected'

const now = new Date()
const options: Options = {
    i18n: {
        firstDayOfWeek: 0,
        timePicker24Hours: true
    },
    showWeekNumber: true,
    constraints: {
        minSpan: 1000 * 60 * 60 * 24 * 3,
        maxSpan: 1000 * 60 * 60 * 24 * 15,
        maxDate: DateTime.fromUTC(now.getUTCFullYear(), now.getUTCMonth(), DateTime.getLastDayOfMonth(now).getUTCDay()),
        minDate: DateTime.addMonths(DateTime.fromUTC(now.getUTCFullYear(), now.getUTCMonth(), 1), -3)
    },
    position: [ 'center', 'down' ],
    ranges: {
        'Last week - ridiculous long label': {
            from: DateTime.withTime(DateTime.addWeeks(new Date(), -1)),
            until: DateTime.withTime(now)
        }
    }
}

const options2: Options = {
    i18n: {
        firstDayOfWeek: 1,
        timePicker24Hours: true
    },
    showSingleCalendar: false,
    showWeekNumber: false,
    constraints: {
        minSpan: 1000 * 60 * 60 * 24 * 3,
        maxSpan: 1000 * 60 * 60 * 24 * 15,
        maxDate: DateTime.addDays(now, 1),
        minDate: new Date('2018-12-31'),
        timeInterval: 1
    },
    position: [ 'center', 'down' ]
}

const options3 = Object.assign({}, options2, { showTimePicker: false })

const RangePicker = withRangeController(DateTimeRangePickerControlled)
const DatePicker  = withController(DateTimeRangePickerControlled)

const withAutoApply = (options: Options): Options => Object.assign({}, options, { autoApply: true })
const withTimePicker = (options: Options): Options => Object.assign({}, options, { showTimePicker: true })

const onChange = (start: Date, end?: Date) =>
{
    console.warn('onChange', { start, end })
}

const render = (children: ReactNode) => {
    console.log('Rendering picker with custom fn', { children })
    return <div className='foo'>{ children }</div>
}

const App: FunctionComponent = () => (
    <div style={ { textAlign: 'center' } }>

        <RangePicker options={ options } onChange={ onChange } render={ render }>
            <button>RangePicker (w/o apply, w/o time)</button>
        </RangePicker>

        <RangePicker options={ withAutoApply(options) } onChange={ onChange }>
            <button>RangePicker (w/ apply, w/o time)</button>
        </RangePicker>

        <RangePicker options={ withTimePicker(withAutoApply(options)) } onChange={ onChange }>
            <button>RangePicker (w/ apply, w/ time)</button>
        </RangePicker>

        <hr/>

        <DatePicker options={ options3 } onChange={ onChange }>
            <button>DatePicker (without auto apply)</button>
        </DatePicker>

        <DatePicker options={ withAutoApply(options3) } onChange={ onChange }>
            <button>DatePicker (with auto apply)</button>
        </DatePicker>

        <hr/>

        <ShowRangesOnlyUnlessCustomRangeIsSelected/>
    </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
