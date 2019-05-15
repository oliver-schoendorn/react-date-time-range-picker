import React, { RefObject, PureComponent, ReactNode, createRef, MouseEvent } from 'react'
import { withContext } from '../Context/withContext'
import { classNames } from '../Helper/classNames'

interface ContextProps
{
    open: boolean
    overlayClassName: string
    position: [ 'left' | 'center' | 'right', 'up' | 'down' ]
    relativeRef?: RefObject<HTMLElement>
    toggle(): void
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
    }

    public componentWillUnmount(): void
    {
        document.removeEventListener('click', this.onClickDocument)
    }

    private onClickDocument = (event: Event) =>
    {
        if (! this.props.open || ! hasRef(this.selfRef)) {
            return
        }

        console.warn('onClickDocument', {
            target: event.target,
            ref: this.selfRef.current,
            contains: this.selfRef.current.contains(event.target as Node)
        })

        if (! this.selfRef.current.contains(event.target as Node)) {
            this.props.toggle()
        }
    }

    public render(): ReactNode
    {
        const { open, position, children, overlayClassName } = this.props
        const className = classNames('-overlay', overlayClassName, ...position, { open: open })

        return <div className={ className } ref={ this.selfRef }>{ children }</div>
    }

    public componentDidUpdate(prevProps: Readonly<ContextProps>): void
    {
        if (this.props.open !== true || prevProps.open === true) {
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

        switch (this.props.position[1]) {
            case 'up':
                self.style.top = (relativeRect.top - selfRect.height - 10) + 'px'
                break

            case 'down':
                self.style.top = (relativeRect.top + relativeRect.height + 10) + 'px'
                break
        }

        switch (this.props.position[0]) {
            case 'left':
                self.style.left = ((relativeRect.left + relativeRect.width) - selfRect.width) + 'px'
                break

            case 'center':
                self.style.left = ((relativeRect.left + relativeRect.width / 2) - selfRect.width / 2) + 'px'
                break

            case 'right':
                self.style.left = relativeRect.left + 'px'
                break
        }
    }
}

const Overlay = withContext<ContextProps>(() => {
    return ({ state, actions, options, relativeRef }) => ({
        open: state.open,
        overlayClassName: options.classNames.overlay,
        position: options.position,
        relativeRef,
        toggle: actions.toggle
    })
})(OverlayComponent)

export { Overlay }
