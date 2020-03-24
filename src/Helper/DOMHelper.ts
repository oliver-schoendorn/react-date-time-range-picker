export interface ScrollOffset
{
    top: number
    left: number
}

export const getScrollOffset = function (): ScrollOffset
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

export interface WindowSize
{
    width: number
    height: number
}

export const getWindowSize = function (): WindowSize
{
    return {
        width: getWindowWidth(),
        height: getWindowHeight()
    }
}

const getWindowWidth = function (): number
{
    if(window.screen !== null) {
        return window.screen.availWidth
    }

    if(window.innerWidth !== null) {
        return window.innerWidth
    }

    if(document.body != null) {
        return document.body.clientWidth
    }

    console.error('Unable to determine usable screen width. Please report here: https://github.com/oliver-schoendorn/react-date-time-range-picker/issues')
    return -1
}

const getWindowHeight = function (): number {
    if(window.screen !== null) {
        return window.screen.availHeight
    }

    if(window.innerHeight !== null) {
        return window.innerHeight
    }

    if(document.body !== null) {
        return document.body.clientHeight
    }

    console.error('Unable to determine usable screen height. Please report here: https://github.com/oliver-schoendorn/react-date-time-range-picker/issues')
    return -1
}
