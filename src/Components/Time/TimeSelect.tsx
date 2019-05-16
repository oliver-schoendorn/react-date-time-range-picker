import React, { FunctionComponent, ReactNode, ChangeEvent, PureComponent } from 'react'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import { withTime } from '../../Helper/DateTime'
import { memoizeFunction } from '../../Helper/Memoize/Memoize'

interface ExternalProps
{
    time: Date | null
    onChange(dateTime: Date): void
}

interface ContextProps
{
    minSpan: number
    maxSpan: number
    timeInterval: number
    format: 12 | 24
}

const getTimeSelectOptions = memoizeFunction((timeInterval: number, timeFormat: 12 | 24): [ number[], number[], number[] ] =>
{
    const hours:   number[] = []
    const minutes: number[] = []
    const seconds: number[] = []

    for (let i = 0; i < 60; ++i) {
        if (i % timeInterval === 0) {
            seconds.push(i)
        }
    }

    for (let i = 0; i < 3600; ++i) {
        if (i % 60 === 0 && i % timeInterval === 0) {
            minutes.push(i/60)
        }
    }

    for (let i = 0; i < 3600 * timeFormat; ++i) {
        if (i % 3600 === 0 && i % timeInterval === 0) {
            hours.push(i/3600 + (timeFormat === 12 ? 1 : 0))
        }
    }

    return [ hours, minutes, seconds ]
})

const renderOptions = (values: number[]): ReactNode[] =>
{
    return values.map(value => (
        <option key={ value } value={ value }>{ value.toString().padStart(2, '0') }</option>
    ))
}

class TimeSelectComponent extends PureComponent<ExternalProps & ContextProps>
{
    private onSelectHours = (event: ChangeEvent<HTMLSelectElement>) =>
    {
        event.preventDefault()

        const hours = parseInt(event.currentTarget.value, 10)
        this.props.onChange(
            withTime(this.props.time, hours, this.props.time.getUTCMinutes(), this.props.time.getUTCSeconds())
        )
    }

    private onSelectMinutes = (event: ChangeEvent<HTMLSelectElement>) =>
    {
        event.preventDefault()

        const minutes = parseInt(event.currentTarget.value, 10)
        this.props.onChange(
            withTime(this.props.time, this.props.time.getUTCHours(), minutes, this.props.time.getUTCSeconds())
        )
    }

    private onSelectSeconds = (event: ChangeEvent<HTMLSelectElement>) =>
    {
        event.preventDefault()

        const seconds = parseInt(event.currentTarget.value, 10)
        this.props.onChange(
            withTime(this.props.time, this.props.time.getUTCHours(), this.props.time.getUTCMinutes(), seconds)
        )
    }

    public render(): ReactNode
    {
        const props = this.props
        const [ hours, minutes, seconds ] = getTimeSelectOptions(props.timeInterval, props.format)

        const selects: ReactNode[] = [
            <select
                key='hours'
                disabled={ ! props.time }
                onChange={ this.onSelectHours }
                value={ props.time ? props.time.getUTCHours() - (props.format === 12 ? 12 : 0) : 0 }
            >
                { renderOptions(hours) }
            </select>
        ]

        if (minutes.length > 1) {
            selects.push(<span key='minutes-separator' className='time-select-separator'>:</span>)
            selects.push(
                <select
                    key='minutes'
                    disabled={ ! props.time }
                    onChange={ this.onSelectMinutes }
                    value={ props.time ? props.time.getMinutes() : 0 }
                >
                    { renderOptions(minutes) }
                </select>
            )
        }

        if (seconds.length > 1) {
            selects.push(<span key='seconds-separator' className='time-select-separator'>:</span>)
            selects.push(
                <select
                    key='seconds'
                    disabled={ ! props.time }
                    onChange={ this.onSelectSeconds }
                    value={ props.time ? props.time.getSeconds() : 0 }
                >
                    { renderOptions(seconds) }
                </select>
            )
        }

        if (props.format === 12) {
            selects.push(
                <select key='am-pm' defaultValue='am' disabled={ ! props.time }>
                    <option value='am'>AM</option>
                    <option value='pm'>PM</option>
                </select>
            )
        }

        return (
            <div className={ classNames('-time-picker') }>
                { selects }
            </div>
        )
    }
}

const TimeSelect = withContext<ContextProps, ExternalProps>(({ options }) => ({
    minSpan: options.constraints.minSpan,
    maxSpan: options.constraints.maxSpan,
    timeInterval: options.constraints.timeInterval,
    format: options.i18n.timePicker24Hours ? 24 : 12
}))(TimeSelectComponent)

export { TimeSelect }
