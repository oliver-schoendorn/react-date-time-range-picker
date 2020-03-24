import { Options } from '../../Context/contextOptions'
import { getScrollOffset, getWindowSize, ScrollOffset } from '../../Helper/DOMHelper'
import { RefObject } from 'react';

export const updateOverlayPosition = function (
    position: Options['position'],
    overlayRef: RefObject<HTMLDivElement>,
    parentRef: RefObject<HTMLElement>
): void
{
    const screenSize   = getWindowSize()
    const scrollOffset = getScrollOffset()
    const overlayRect  = overlayRef.current.getBoundingClientRect()
    const parentRect   = parentRef.current.getBoundingClientRect()

    // Protect against overflow (aka overlay is outside of viewport)
    const top  = between(getOverlayPositionTop(position, scrollOffset, overlayRect, parentRect), 0, screenSize.height)
    const left = between(getOverlayPositionLeft(position, scrollOffset, overlayRect, parentRect), 0, screenSize.width)

    overlayRef.current.style.top  = top + 'px'
    overlayRef.current.style.left = left + 'px'
}

const getOverlayPositionLeft = function (
    position: Options['position'],
    { left: leftScrollOffset }: ScrollOffset,
    overlayRect: ClientRect,
    parentRect: ClientRect
): number
{
    switch (position[0]) {
        case 'left':   return (parentRect.left + parentRect.width) - overlayRect.width + leftScrollOffset
        case 'center': return (parentRect.left + parentRect.width / 2) - (overlayRect.width / 2) + leftScrollOffset
        case 'right':  return parentRect.left + leftScrollOffset
    }
}

const getOverlayPositionTop = function (
    position: Options['position'],
    { top: topScrollOffset }: ScrollOffset,
    overlayRect: ClientRect,
    parentRect: ClientRect
): number
{
    switch (position[1]) {
        case 'up':   return parentRect.top - overlayRect.height - 10 + topScrollOffset
        case 'down': return parentRect.top + parentRect.height + 10 + topScrollOffset
    }
}

const between = function (number: number, min: number, max: number): number
{
    return Math.min(Math.max(number, min), max)
}
