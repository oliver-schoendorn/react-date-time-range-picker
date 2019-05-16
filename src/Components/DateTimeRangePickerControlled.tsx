import React, { PureComponent, ReactNode, Fragment, RefObject, createRef, MouseEvent } from 'react'
import { Calendar } from './Calendar/Calendar'
import { Overlay } from './Overlay'
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

        const cancelBtnClassNames = classNames(
            'btn btn-sm btn-link',
            context.options.classNames.cancelButton
        )

        const submitBtnClassNames = classNames(
            'btn btn-sm btn-primary',
            context.options.classNames.submitButton
        )

        return (
            <Fragment>
                <span ref={ this.childRef }>{ this.props.children }</span>
                <div className={ classNames('date-time-range-picker', context.options.classNames.wrapper) }>
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
                                <div className='selection'>
                                    { context.options.i18n.formatResult(context.state.start, context.state.end) }
                                </div>

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
            </Fragment>
        )
    }
}

export { DateTimeRangePickerControlled }
