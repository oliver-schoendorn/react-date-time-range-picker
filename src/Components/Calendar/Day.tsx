import React, { FunctionComponent } from 'react'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import * as DateTime from '../../Helper/DateTime'
import { getCurrentSelection } from '../../Selectors/getCurrentSelection'
import { isDayDisabled } from '../../Selectors/isDayDisabled'
import { isDaySelectable } from '../../Selectors/isDaySelectable'
import { isDayEndOfSelection } from '../../Selectors/isDayEndOfSelection'
import { isDayStartOfSelection } from '../../Selectors/isDayStartOfSelection'

interface Props
{
    day: Date
    month: Date
}

interface ContextProps
{
    dayClassName: null | string | ((date: Date) => string | null)
    hoverDate: (date: Date) => void
    leaveDate: (date: Date) => void
    clickDate: (date: Date) => void
    formatDate: (date: Date) => string
    isStartDate: boolean
    isEndDate: boolean
    isSelected: boolean
    isSelectable: boolean
    isDisabled: boolean
}

const DayComponent: FunctionComponent<Props & ContextProps> = (props) => (
    <td
        onMouseOver={ props.hoverDate.bind(null, props.day) }
        onMouseOut={ props.leaveDate.bind(null, props.day) }
    >
        <div
            title={ props.formatDate(props.day) }
            className={ classNames(
                '-week-day',
                typeof props.dayClassName === 'function'
                    ? props.dayClassName(props.day)
                    : props.dayClassName,
                {
                    disabled: props.isDisabled,
                    selectable: props.isSelectable,
                    today: DateTime.isToday(props.day),
                    hover: DateTime.dateEquals(props.day, props.hoverDate),
                    'selection': ! props.isDisabled && props.isSelected,
                    'selection-start': ! props.isDisabled && props.isStartDate,
                    'selection-end': ! props.isDisabled && props.isEndDate,
                }
            ) }
        >
            <div
                className='inner'
                onClick={ props.clickDate.bind(null, props.day) }
            >
                { props.day.getDate() }
            </div>
        </div>
    </td>
)

const noop = () => void 0

const Day = withContext<ContextProps, Props>(
    () => {
        const isDisabled   = isDayDisabled()
        const isSelectable = isDaySelectable()

        return (context, { day, month }) => {
            const selectable = isSelectable(context.options.constraints, context.state, day)
            const disabled   = isDisabled(day, month)

            return {
                dayClassName: context.options.classNames.day,
                hoverDate: disabled ? noop : context.actions.hoverDate,
                leaveDate: disabled ? noop : context.actions.leaveDate,
                clickDate: selectable ? context.actions.clickDate : noop,
                formatDate: context.options.i18n.formatDate,
                isStartDate: isDayStartOfSelection(day, context.state.start, context.state.end, context.state.hovered),
                isEndDate: isDayEndOfSelection(day, context.state.start, context.state.end, context.state.hovered),
                isSelected: DateTime.dateBetween(day, ...getCurrentSelection(context)),
                isDisabled: disabled,
                isSelectable: selectable
            }
        }
    }
)(DayComponent)

export { Day }
