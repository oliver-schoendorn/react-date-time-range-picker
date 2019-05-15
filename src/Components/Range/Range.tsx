import React, { PureComponent, ReactNode, MouseEvent } from 'react'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import { dateEquals, max, min } from '../../Helper/DateTime'

interface ExternalProps
{
    label: string
    selected: boolean
}

interface ContextProps
{
    startDate: Date | null
    endDate: Date | null
    range: { from: Date, until: Date }
    selectDate(startDate: Date, endDate: Date): void
}

class RangeComponent extends PureComponent<ExternalProps & ContextProps>
{
    private onClick = (event: MouseEvent<HTMLAnchorElement>) =>
    {
        event.preventDefault()
        this.props.selectDate(this.props.range.from, this.props.range.until)
    }

    private isSelected(): boolean
    {
        const { startDate, endDate, range } = this.props

        const rangeStart = min(range.from, range.until)
        const rangeEnd   = max(range.from, range.until)

        return dateEquals(startDate, rangeStart) && dateEquals(endDate, rangeEnd)
    }

    public render(): ReactNode
    {
        return (
            <a
                href='#'
                onClick={ this.onClick }
                className={ classNames('range', { selected: this.isSelected() }) }
            >
                { this.props.label }
            </a>
        )
    }
}

const Range = withContext<ContextProps, ExternalProps>(({ state, options, actions }, { label }) => ({
    startDate: state.start,
    endDate: state.end,
    range: options.ranges[label],
    selectDate: actions.selectDate
}))(RangeComponent)

export { Range }
