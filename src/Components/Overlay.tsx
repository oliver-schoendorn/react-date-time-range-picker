import React, { RefObject, PureComponent, ReactNode, createRef } from 'react'
import { withContext } from '../Context/withContext'
import { classNames } from '../Helper/classNames'

interface ContextProps
{
    open: boolean
    overlayClassName: string
    position: [ 'left' | 'center' | 'right', 'up' | 'down' ]
    relativeRef?: RefObject<HTMLElement>
    cancel(): void
}

function hasRef<T extends HTMLElement>(ref: RefObject<T> | undefined): ref is RefObject<T>
{
    return ref && ref.current instanceof HTMLElement
}

class OverlayComponent extends PureComponent<ContextProps>
{
    private readonly selfRef: RefObject<HTMLDivElement>

    constructor(props)
    {
        super(props)
        this.selfRef = createRef()
    }

    public componentWillMount(): void
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
        const className = classNames('-overlay', overlayClassName, ...position, { open: open })

        return <div className={ className } ref={ this.selfRef }>{ open && children }</div>
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

        const self = this.selfRef.current
        const selfRect = self.getBoundingClientRect()

        const relative = this.props.relativeRef.current
        const relativeRect = relative.getBoundingClientRect()

        self.style.top  = OverlayComponent.getTopPosition(this.props.position[1], selfRect, relativeRect) + 'px'
        self.style.left = OverlayComponent.getLeftPosition(this.props.position[0], selfRect, relativeRect) + 'px'
    }

    private static getScrollOffset(): { top: number, left: number }
    {
        // This works for all browsers except IE versions 8 and before
        if (window.pageXOffset != null) {
            return { top: window.pageYOffset, left: window.pageXOffset }
        }

        // For IE (or any browser) in Standards mode
        if (document.compatMode == "CSS1Compat") {
            return { top: document.documentElement.scrollTop, left: document.documentElement.scrollLeft }
        }

        // For browsers in Quirks mode
        return { top: document.body.scrollTop, left: document.body.scrollLeft }
    }

    private static getTopPosition(
        position: ContextProps['position'][1],
        overlay: ClientRect,
        relative: ClientRect
    ): number
    {
        const { top } = OverlayComponent.getScrollOffset()

        switch (position) {
            case 'up':   return relative.top - overlay.height - 10 + top
            case 'down': return relative.top + relative.height + 10 + top
        }
    }

    private static getLeftPosition(
        position: ContextProps['position'][0],
        overlay: ClientRect,
        relative: ClientRect
    ): number
    {
        const { left } = OverlayComponent.getScrollOffset()

        switch (position) {
            case 'left':   return (relative.left + relative.width) - overlay.width + left
            case 'center': return (relative.left + relative.width / 2) - (overlay.width / 2) + left
            case 'right':  return relative.left + left
        }
    }
}

const Overlay = withContext<ContextProps>(({ state, actions, options, relativeRef }) => ({
    open: state.open,
    overlayClassName: options.classNames.overlay,
    position: options.position,
    relativeRef,
    cancel: actions.cancel
}))(OverlayComponent)

export { Overlay }
