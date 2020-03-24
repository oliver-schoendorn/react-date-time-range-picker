import React, { PureComponent, ReactNode, Fragment, RefObject, createRef, MouseEvent } from 'react'
import { Calendar } from './Calendar/Calendar'
import { Overlay } from './Overlay/Overlay'
import { Selection } from './Selection'
import { Ranges } from './Range/Ranges'
import { ContextCreator, contextMemoizer } from '../Context/contextMemoizer'
import { Options } from '../Context/contextOptions'
import {
    ContextActions,
    DateTimeRangePickerContextProvider,
    ContextState,
} from '../Context/Context'
import { classNames } from '../Helper/classNames'

export interface Props
{
    state: ContextState
    actions: ContextActions
    options?: Options
    children: ReactNode
    render?(picker: ReactNode): ReactNode
}

class DateTimeRangePickerControlled extends PureComponent<Props>
{
    private readonly childRef: RefObject<any>
    private readonly memoizedContext: ContextCreator

    public constructor(props: Props)
    {
        super(props)

        this.childRef = createRef()
        this.memoizedContext = contextMemoizer({ ...props.actions })
    }

    public componentDidMount(): void
    {
        this.childRef.current.addEventListener('click', this.onClickRef)
    }

    public componentWillUnmount(): void
    {
        this.childRef.current.addEventListener('click', this.onClickRef)
    }

    private onClickRef = (event: Event) =>
    {
        event.preventDefault()
        event.stopPropagation()
        this.props.actions.toggle()
    }

    private onApply = (event: MouseEvent<HTMLButtonElement>) =>
    {
        event.preventDefault()
        this.props.actions.apply()
    }

    private onCancel = (event: MouseEvent<HTMLButtonElement>) =>
    {
        event.preventDefault()
        this.props.actions.cancel()
    }

    public render(): ReactNode
    {
        const context = this.memoizedContext(
            this.props.state,
            this.props.options,
            this.childRef
        )

        const wrapperClassNames = classNames(
            'date-time-range-picker',
            context.options.classNames.wrapper,
            { 'has-ranges': context.options.ranges && Object.keys(context.options.ranges).length > 0 }
        )

        const cancelBtnClassNames = classNames(
            'btn btn-sm btn-link',
            context.options.classNames.cancelButton
        )

        const submitBtnClassNames = classNames(
            'btn btn-sm btn-primary',
            context.options.classNames.submitButton
        )

        const pickerComponents: ReactNode = (
            <div className={ wrapperClassNames }>
                <DateTimeRangePickerContextProvider value={ context }>
                    <Overlay>
                        <div className={ classNames('-cols') }>
                            <Ranges/>
                            { context.options.showSingleCalendar
                                ? (
                                    <Calendar type='both'/>
                                ) : (
                                    <Fragment>
                                        <Calendar type='left'/>
                                        <div className={ classNames('-col-spacer') }/>
                                        <Calendar type='right'/>
                                    </Fragment>
                                )
                            }
                        </div>
                        <div className={ classNames('-footer') }>
                            <Selection/>

                            <div className='buttons'>
                                <button className={ cancelBtnClassNames } onClick={ this.onCancel }>
                                    { context.options.i18n.labels.cancel }
                                </button>

                                <button className={ submitBtnClassNames } onClick={ this.onApply }>
                                    { context.options.i18n.labels.apply }
                                </button>
                            </div>
                        </div>
                    </Overlay>
                </DateTimeRangePickerContextProvider>
            </div>
        )

        return (
            <Fragment>
                <span ref={ this.childRef }>{ this.props.children }</span>
                { this.props.render && typeof this.props.render === 'function'
                    ? this.props.render(pickerComponents)
                    : pickerComponents
                }
            </Fragment>
        )
    }
}

export { DateTimeRangePickerControlled }
