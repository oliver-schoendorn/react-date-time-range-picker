import React, { FunctionComponent, useState, useLayoutEffect } from 'react'
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
    // Keep track of whether a range is selected or not
    const [ rangeSelected, setRangeSelected ] = useState<boolean>(true)
    const onUpdateSelection = (start: Date, end: Date) => {
        setRangeSelected(isRangeSelected(start, end))
    }

    // When changing from `a predefined range is selected` to `a custom range is selected`
    // the size of the overlay will change and its position will be all over the place.
    // Therefore a resize-event is triggered AFTER the DOM Changes are completed
    useLayoutEffect(() => {
        if (rangeSelected === false) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [ rangeSelected ])

    const onChange = (start: Date, end: Date) => {
        console.log('Changed selection', {
            start: start.toISOString(),
            end: end.toISOString()
        })
    }

    return (
        <div className={ rangeSelected ? 'predefined-range' : 'custom-range' }>
            <RangePicker
                options={ options }
                initialState={ initialState }
                onChange={ onChange }
                onUpdateSelection={ onUpdateSelection }
            >
                <button>ShowRangesOnlyUnlessCustomRangeIsSelected</button>
            </RangePicker>
        </div>
    )
}
