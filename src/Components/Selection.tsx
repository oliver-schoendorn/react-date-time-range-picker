import React, { FunctionComponent } from 'react'
import { withContext } from '../Context/withContext'

interface Context
{
    start: Date | null
    end: Date | null
    formatDate: (date: Date) => string
    resultSeparator: string
}

const SelectionComponent: FunctionComponent<Context> = (props) => (
    <div className='selection'>
        <span className='selection-value'>{ props.start && props.formatDate(props.start) }</span>
        <span className='selection-separator'>{ props.start && props.end && props.resultSeparator }</span>
        <span className='selection-value'>{ props.end && props.formatDate(props.end) }</span>
    </div>
)

const Selection = withContext<Context>(({ state, options: { i18n } }) => ({
    start: state.start,
    end: state.end,
    formatDate: i18n.formatDate,
    resultSeparator: i18n.resultRangeSeparator
}))(SelectionComponent)

export { Selection }
