import React, { FunctionComponent, MouseEvent } from 'react'
import { Context } from '../../Context/Context'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import { getSelectedRangeLabelSelector } from '../../Selectors/getSelectedRangeLabel'
import { Range } from './Range'

interface ContextProps
{
    selectedRangeLabel: string | 'custom' | null
    context: Context
}

const RangesComponent: FunctionComponent<ContextProps> = ({ selectedRangeLabel, context }) =>
{
    const {
        options: { ranges, i18n: { labels: { customRange } } },
        actions: { clickDate }
    } = context

    const onClickCustom = (event: MouseEvent<HTMLAnchorElement>) =>
    {
        event.preventDefault()

        const closestSelectableDate = typeof context.options.customRangeStartDate === 'function'
            ? context.options.customRangeStartDate(context)
            : context.options.customRangeStartDate

        if (closestSelectableDate) {
            clickDate(closestSelectableDate)
        }
    }

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
                { customRange }
            </a>
        </div>
    )
}

const Ranges = withContext<ContextProps>(() => {
    const getSelectedRangeLabel = getSelectedRangeLabelSelector()
    return (context) => ({
        context,
        selectedRangeLabel: getSelectedRangeLabel(context),
    })
})(RangesComponent)

export { Ranges }
