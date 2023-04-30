import React, { RefObject, PureComponent, PropsWithChildren, ReactNode, createRef } from 'react'
import { Options } from '../../Context/contextOptions'
import { withContext } from '../../Context/withContext'
import { classNames } from '../../Helper/classNames'
import { updateOverlayPosition } from './OverlayHelper'

interface ContextProps
{
    open: boolean
    overlayClassName: string
    position: Options['position']
    relativeRef?: RefObject<HTMLElement>
    cancel(): void
}

function hasRef<T extends HTMLElement>(ref: RefObject<T> | undefined): ref is RefObject<T>
{
    return ref && ref.current instanceof HTMLElement
}

class OverlayComponent extends PureComponent<PropsWithChildren<ContextProps>>
{
    private readonly selfRef: RefObject<HTMLDivElement>

    constructor(props)
    {
        super(props)
        this.selfRef = createRef()
    }

    public componentDidMount(): void
    {
        document.addEventListener('click', this.onClickDocument)
        window.addEventListener('resize', this.updatePosition)
        window.addEventListener('orientationchange', this.updatePosition)
    }

    public componentWillUnmount(): void
    {
        document.removeEventListener('click', this.onClickDocument)
        window.removeEventListener('resize', this.updatePosition)
        window.removeEventListener('orientationchange', this.updatePosition)
    }

    public componentDidUpdate(prevProps: Readonly<ContextProps>): void
    {
        if (this.props.open !== prevProps.open || this.props.position !== prevProps.position) {
            this.updatePosition()
        }
    }

    private onClickDocument = (event: Event) =>
    {
        if (! this.props.open || ! hasRef(this.selfRef)) {
            return
        }

        if (! this.selfRef.current.contains(event.target as Node)) {
            this.props.cancel()
        }
    }

    public render(): ReactNode
    {
        const { open, position, children, overlayClassName } = this.props
        const className = classNames(
            '-overlay',
            overlayClassName,
            { open: open },
            typeof position === 'function'
                ? 'center down'
                : position.join(' ')
        )

        return (
            <div className={ className } ref={ this.selfRef }>
                { open && children }
            </div>
        )
    }

    private updatePosition = () =>
    {
        if (! this.props.open) {
            return
        }

        if (! hasRef(this.props.relativeRef) || ! hasRef(this.selfRef)) {
            console.error('DateTimePicker is missing a ref to a DOM Node')
            return
        }

        typeof this.props.position === 'function'
            ? this.props.position(this.selfRef, this.props.relativeRef)
            : updateOverlayPosition(this.props.position, this.selfRef, this.props.relativeRef)
        }
}

const Overlay: React.ComponentType<PropsWithChildren> = withContext<ContextProps>(({ state, actions, options, relativeRef }) => ({
    open: state.open,
    overlayClassName: options.classNames.overlay,
    position: options.position,
    relativeRef,
    cancel: actions.cancel
}))(OverlayComponent)

export { Overlay }
