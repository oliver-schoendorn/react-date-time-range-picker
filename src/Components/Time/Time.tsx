import React, { FunctionComponent, Fragment } from 'react'
import { withContext } from '../../Context/withContext'
import { TimeSelect } from './TimeSelect'

interface ExternalProps
{
    type: 'left' | 'right' | 'both'
}

interface ContextProps
{
    start: Date | null
    end: Date | null
    selectDate(startDate: Date, endDate: Date): void
}

const TimeComponent: FunctionComponent<ExternalProps & ContextProps> = (props) =>
{
    const start = props.start && props.end ? props.start : null
    const end   = props.start && props.end ? props.end : null

    const setStart = (dateTime: Date) => props.selectDate(dateTime, end)
    const setEnd   = (dateTime: Date) => props.selectDate(start, dateTime)

    if (props.type === 'both') {
        return (
            <Fragment>
                <TimeSelect time={ start } onChange={ setStart }/>
                <span className='time-picker-separator'>-</span>
                <TimeSelect time={ end } onChange={ setEnd }/>
            </Fragment>
        )
    }

    return (
        <TimeSelect
            time={ props.type === 'left' ? start : end }
            onChange={ props.type === 'left' ? setStart : setEnd }
        />
    )
}

const Time = withContext<ContextProps, ExternalProps>(({ state, actions }) => ({
    start: state.start,
    end: state.end,
    selectDate: actions.selectDate
}))(TimeComponent)

export { Time }
