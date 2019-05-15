type ClassNameArgs = string | { [key: string]: boolean }

export function classNames(...args: ClassNameArgs[]): string
{
    const classNames: string[] = []
    for (const arg of args) {
        if (typeof arg === 'string') {
            classNames.push(arg)
            continue
        }

        if (arg && typeof arg === 'object') {
            Object.entries(arg).map(([ key, value ]) => {
                if (value === true) {
                    classNames.push(key)
                }
            })
        }
    }

    return classNames
        .filter(className => typeof className === 'string' && className.length > 0)
        .map(className => {
            if (className.substr(0, 1) === '-') {
                return 'date-time-range-picker' + className
            }

            return className
        })
        .join(' ')
}
