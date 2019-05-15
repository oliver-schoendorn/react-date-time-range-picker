import React, { FunctionComponent, MouseEvent } from 'react'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import { getSelectedRangeLabelSelector } from '../../Selectors/getSelectedRangeLabel'
import { Range } from './Range'

interface ContextProps
{
    ranges: {
        [label: string]: {
            from: Date
            until: Date
        }
    }
    customRangeLabel: string
    selectedRangeLabel: string | 'custom' | null
}

const onClickCustom = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()

const RangesComponent: FunctionComponent<ContextProps> = ({ ranges, customRangeLabel, selectedRangeLabel }) =>
{
    if (! ranges) {
        return null
    }

    const labels = Object.keys(ranges)
    if (labels.length === 0) {
        return null
    }

    return (
        <div className={ classNames('-ranges') }>
            { labels.map(label => (
                <Range
                    key={ label }
                    label={ label }
                    selected={ label === selectedRangeLabel }
                />
            )) }
            <a
                key={ 'custom' }
                href='#'
                onClick={ onClickCustom }
                className={ classNames('range', { selected: selectedRangeLabel === 'custom' }) }
            >
                { customRangeLabel }
            </a>
        </div>
    )
}

const Ranges = withContext<ContextProps>(() => {
    const getSelectedRangeLabel = getSelectedRangeLabelSelector()
    return (context) => ({
        ranges: context.options.ranges,
        customRangeLabel: context.options.i18n.labels.customRange,
        selectedRangeLabel: getSelectedRangeLabel(context)
    })
})(RangesComponent)

export { Ranges }
