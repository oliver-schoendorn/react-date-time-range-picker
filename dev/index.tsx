import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom'
import { withController } from '../src/Controller/WithController'
import { withRangeController } from '../src/Controller/WithRangeController'
import * as DateTime from '../src/Helper/DateTime'
import { Options } from '../src/Context/contextOptions'
import { DateTimeRangePickerControlled } from '../src'
import '../src/Styles/DateTimeRangePicker.scss'

const options: Options = {
    i18n: {
        firstDayOfWeek: 0,
        timePicker24Hours: true
    },
    showTimePicker: true,
    showWeekNumber: true,
    constraints: {
        minSpan: 1000 * 60 * 60 * 24 * 3,
        maxSpan: 1000 * 60 * 60 * 24 * 15,
        maxDate: new Date('2019-06-01'),
        minDate: new Date('2019-01-01')
    }
}

const options2: Options = {
    i18n: {
        firstDayOfWeek: 1,
        timePicker24Hours: true
    },
    showSingleCalendar: false,
    showWeekNumber: false,
    showTimePicker: true,
    constraints: {
        minSpan: 1000 * 60 * 60 * 24 * 3,
        maxSpan: 1000 * 60 * 60 * 24 * 15,
        maxDate: new Date(),
        minDate: new Date('2018-12-31'),
        timeInterval: 1
    },
    position: [ 'center', 'down' ],
    ranges: {
        'Last week - ridiculous long label': {
            from: DateTime.withTime(DateTime.addWeeks(new Date(), -1)),
            until: DateTime.withTime(new Date())
        }
    }
}

const options3 = Object.assign({}, options2, { showTimePicker: false })

const RangePicker = withRangeController(DateTimeRangePickerControlled)
const DatePicker  = withController(DateTimeRangePickerControlled)

const App: FunctionComponent = () => (
    <div style={ { marginTop: 500, textAlign: 'center' } }>

        {/*<button ref={ ref1 } onClick={ () => console.warn(ref1) }>select date</button>*/}
        {/*<DateTimeRangePicker options={ options2 } refObject={ ref1 }/>*/}

        <RangePicker
            // initialState={ { month: new Date('2018-02-01') } }
            options={ options }
            onChange={ (start, end) => console.log('onChangeRange', start, end) }
        >
            <button>RangePicker</button>
        </RangePicker>

        <hr/>

        <DatePicker onChange={ date => console.log('onChangeDate', date) } options={ options3 }>
            <button>DatePicker</button>
        </DatePicker>
    </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
