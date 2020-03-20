import React, { FunctionComponent, useState } from 'react'
import { DateTimeRangePickerControlled } from '../src'
import { ContextState } from '../src/Context/Context'
import { Options } from '../src/Context/contextOptions'
import { withRangeController } from '../src/Controller/WithRangeController'
import * as DateTime from '../src/Helper/DateTime'
import './ShowRangesOnlyUnlessCustomRangeIsSelected.scss'

const now = DateTime.withTime(new Date())
const lastWeek = DateTime.addWeeks(now, -1)

const ranges: Options['ranges'] = {
    'this week': {
        from: DateTime.getFirstDayOfWeek(now),
        until: now
    },
    'last week': {
        from: DateTime.getFirstDayOfWeek(lastWeek),
        until: DateTime.addDays(DateTime.getFirstDayOfWeek(now), -1)
    }
}

const options: Options = {
    i18n: {
        firstDayOfWeek: 1,
        timePicker24Hours: true
    },
    autoApply: true,
    showTimePicker: false,
    position: [ 'center', 'down' ],
    ranges
}

const initialState: Partial<ContextState> = {
    start: ranges['last week'].from,
    end: ranges['last week'].until
}

const RangePicker = withRangeController(DateTimeRangePickerControlled)

const isRangeSelected = function(start: Date, end: Date): boolean
{
    for (const range of Object.values(ranges)) {
        if (DateTime.dateEquals(range.from, start) && DateTime.dateEquals(range.until, end)) {
            return true
        }
    }

    return false
}

export const ShowRangesOnlyUnlessCustomRangeIsSelected: FunctionComponent = () =>
{
    const [ rangeSelected, setRangeSelected ] = useState<boolean>(true)

    const onChange = (start: Date, end: Date) => {
        setRangeSelected(isRangeSelected(start, end))
    }

    return (
        <div className={ rangeSelected ? 'predefined-range' : 'custom-range' }>
            <RangePicker
                options={ options }
                initialState={ initialState }
                onChange={ onChange }
                onUpdateSelection={ onChange }
            >
                <button>ShowRangesOnlyUnlessCustomRangeIsSelected</button>
            </RangePicker>
        </div>
    )
}
