export function debounce<R, T extends (...args: any[]) => R>(fn: T, delay: number = 0): ((...args: any) => Promise<R>)
{
    return function (...args: any[]) {
        return new Promise<R>(resolve => {
            setTimeout(() => resolve(fn(...args)), delay)
        })
    }
}
