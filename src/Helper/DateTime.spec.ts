import { withTime } from './DateTime'
import * as DateTime from './DateTime'

describe('DateTime', function () {
    describe('clone', function () {
        it('should create clones without changing the date', function () {
            const date = new Date()
            const clonedDate = DateTime.clone(date)

            expect(date.valueOf()).toEqual(clonedDate.valueOf())
            expect(date).not.toBe(clonedDate)
        })
    })

    describe('isDate', function () {
        it('should return true if only dates are given', function () {
            expect(DateTime.isDate(new Date())).toEqual(true)
            expect(DateTime.isDate(new Date(), new Date())).toEqual(true)
            expect(DateTime.isDate(new Date(), undefined, new Date())).toEqual(false)
        })
    })

    describe('getFirstDayOfMonth', function () {
        it('should return the first day of the month', function () {
            const date = new Date('2019-02-11')
            const expected = new Date('2019-02-01')
            const actual = DateTime.getFirstDayOfMonth(date)

            expect(actual).not.toBe(date)
            expect(actual.toISOString()).toEqual(expected.toISOString())
        })
    })

    describe('getLastDayOfMonth', function () {
        it('should return the last day of the month', function () {
            const date = new Date('2019-02-01')
            const expected = new Date('2019-02-28')
            const actual = DateTime.getLastDayOfMonth(date)

            expect(actual).not.toBe(date)
            expect(actual.toISOString()).toEqual(expected.toISOString())
        })
    })

    describe('getFirstDayOfWeek', function () {
        it('should return the first day of the month', function () {
            const date = new Date('2019-02-03')
            const expected = new Date('2019-01-28')
            const actual = DateTime.getFirstDayOfWeek(date)

            expect(actual).not.toBe(date)
            expect(actual.toISOString()).toEqual(expected.toISOString())
        })

        it('should handle februaries', function () {
            const date = new Date('2019-03-02')
            const expected = new Date('2019-02-25')
            const actual = DateTime.getFirstDayOfWeek(date)

            expect(actual).not.toBe(date)
            expect(actual.toISOString()).toEqual(expected.toISOString())
        })

        it('should handle custom first day of week', function () {
            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 0))
                .toEqual(new Date('2019-02-24'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 1))
                .toEqual(new Date('2019-02-25'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 2))
                .toEqual(new Date('2019-02-26'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 3))
                .toEqual(new Date('2019-02-27'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 4))
                .toEqual(new Date('2019-02-28'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 5))
                .toEqual(new Date('2019-03-01'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-03-02'), 6))
                .toEqual(new Date('2019-03-02'))


            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 0))
                .toEqual(new Date('2019-04-28'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 1))
                .toEqual(new Date('2019-04-29'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 2))
                .toEqual(new Date('2019-04-30'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 3))
                .toEqual(new Date('2019-05-01'))

            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 4))
                .toEqual(new Date('2019-04-25')) // -> 29

            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 5))
                .toEqual(new Date('2019-04-26')) // -> 30

            expect(DateTime.getFirstDayOfWeek(new Date('2019-05-01'), 6))
                .toEqual(new Date('2019-04-27')) // -> 01
        })
    })

    describe('getWeekNumber', function () {
        it('should return the correct week number', function () {
            expect(DateTime.getWeekNumber(new Date('2019-01-01'))).toEqual(1)
            expect(DateTime.getWeekNumber(new Date('2019-01-04'))).toEqual(1)
            expect(DateTime.getWeekNumber(new Date('2019-02-28 23:59:59'))).toEqual(9)
            expect(DateTime.getWeekNumber(new Date('2016-02-29 23:59:59'))).toEqual(9)
            expect(DateTime.getWeekNumber(new Date('2016-02-29 23:59:59'))).toEqual(9)
            expect(DateTime.getWeekNumber(new Date('2016-03-07'))).toEqual(10)
            expect(DateTime.getWeekNumber(new Date('Jan 1, 2016'))).toEqual(53)
            expect(DateTime.getWeekNumber(new Date('Jan 2, 2011'))).toEqual(52)
        })
    })

    describe('addDays', function () {
        it('should add days', function () {
            const date = new Date('2019-02-01')
            const expected = new Date('2019-02-05')
            const actual = DateTime.addDays(date, 4)

            expect(actual).not.toBe(date)
            expect(actual.valueOf()).toEqual(expected.valueOf())
        })

        it('should subtract days', function () {
            const date = new Date('2019-02-01')
            const expected = new Date('2019-01-30')
            const actual = DateTime.addDays(date, -2)

            expect(actual).not.toBe(date)
            expect(actual.valueOf()).toEqual(expected.valueOf())
        })
    })

    describe('addWeeks', function () {
        it('should add weeks', function () {
            const date = new Date('2019-02-01')
            const expected = new Date('2019-03-01')
            const actual = DateTime.addWeeks(date, 4)

            expect(actual).not.toBe(date)
            expect(actual.valueOf()).toEqual(expected.valueOf())
        })

        it('should subtract weeks', function () {
            const date = new Date('2019-02-01')
            const expected = new Date('2019-01-18')
            const actual = DateTime.addWeeks(date, -2)

            expect(actual).not.toBe(date)
            expect(actual.toISOString()).toEqual(expected.toISOString())
        })
    })

    describe('addMonths', function () {
        const test = (input: string, addMonths: number, expected: string) =>
        {
            const inputDate = new Date(input)
            const expectedDate = new Date(expected)
            expect(DateTime.addMonths(inputDate, addMonths).toISOString())
                .toEqual(expectedDate.toISOString())
        }

        it('should add months', function () {
            test('2019-01-01', 1, '2019-02-01')
            test('2019-01-31', 1, '2019-02-28')
            test('2019-01-31', 2, '2019-03-31')
            test('2019-01-31', 3, '2019-04-30')
        })

        it('should subtract months', function () {
            test('2019-04-30', -3, '2019-01-30')
            test('2019-01-31', -4, '2018-09-30')
        })
    })

    describe('getDaysInMonth', function () {
        const test = (date: string, expectedDays: number) =>
        {
            const dateTime = new Date(date)
            expect(DateTime.getDaysInMonth(dateTime)).toEqual(expectedDays)
        }

        it('should return the amount of days of a given month', function () {
            test('2019-01-01', 31)
            test('2019-02-01', 28)
            test('2019-03-01', 31)
            test('2019-04-25', 30)
            test('2016-02-01', 29)
        })
    })

    describe('withTime', function () {
        it('should be capable of changing the time', function () {
            const date = new Date()
            const origDateTime = date.valueOf()
            const changedDate = DateTime.withTime(date, 0, 0, 0)

            expect(date).not.toBe(changedDate)
            expect(date.valueOf()).toEqual(origDateTime)
            expect(date.valueOf()).toBeGreaterThan(changedDate.valueOf())
            expect(changedDate.getUTCHours()).toEqual(0)
            expect(changedDate.getUTCMinutes()).toEqual(0)
            expect(changedDate.getUTCSeconds()).toEqual(0)
        })

        it('should assign the time of one date to another', function () {
            const date1 = new Date('2019-01-01 12:34:56 +0000')
            const date2 = new Date('2019-02-02 01:23:45 +0000')
            const changedDate = DateTime.withTime(date1, date2)

            // Check immutability
            expect(date1).not.toBe(changedDate)
            expect(date2).not.toBe(changedDate)

            // Check time of the change date
            expect(changedDate.getUTCHours()).toEqual(date2.getUTCHours())
            expect(changedDate.getUTCMinutes()).toEqual(date2.getUTCMinutes())
            expect(changedDate.getUTCSeconds()).toEqual(date2.getUTCSeconds())
            expect(changedDate.getUTCMilliseconds()).toEqual(date2.getUTCMilliseconds())
        })

        it('should set the time to 00:00:00 if time was not supplied', function () {
            const date1 = new Date('2019-02-02 12:34:56 +0000')
            const date2 = new Date('2019-02-02 00:00:00 +0000')

            expect(withTime(date1)).toEqual(date2)
        })
    })

    describe('dateEquals', function () {
        const test = (dateStringA: string, dateStringB: string, expected: boolean) =>
        {
            const dateA = new Date(dateStringA)
            const dateB = new Date(dateStringB)

            expect(DateTime.dateEquals(dateA, dateB)).toEqual(expected)
        }

        it('should compare dates properly', function () {
            test('2018-04-25', '2018-04-24', false)
            test('2018-04-25', '2018-04-25', true)
            test('2018-04-25 01:23:45 +0000', '2018-04-25 12:34:56 +0000', true)
            test('2018-04-25 00:00:00 +0000', '2018-04-25 23:59:59 +0000', true)
        })

        it('should handle non-date objects', function () {
            expect(DateTime.dateEquals(new Date(), false)).toEqual(false)
        })
    })

    describe('isToday', function () {
        it('should return true if the given date matches "today"', function () {
            expect(DateTime.isToday(new Date('2018-01-02'))).toEqual(false)
            expect(DateTime.isToday(new Date())).toEqual(true)
        })
    })

    describe('dateBetween', function () {
        it('should return false if non-dates are passed', function () {
            expect(DateTime.dateBetween(new Date(), undefined, new Date())).toEqual(false)
        })

        it('should return true if the date range equals the given date', function () {
            expect(DateTime.dateBetween(
                new Date(),
                new Date(),
                new Date()
            )).toEqual(true)
        })

        it('should return false if the date is outside the given range', function () {
            expect(DateTime.dateBetween(
                new Date(),
                DateTime.addDays(new Date(), 1),
                DateTime.addDays(new Date(), 2),
            )).toEqual(false)
        })

        it('should return true if the date is inside the given range', function () {
            expect(DateTime.dateBetween(
                new Date(),
                DateTime.addDays(new Date(), -1),
                DateTime.addDays(new Date(), 1),
            )).toEqual(true)
        })

        it('should not care about the date order', function () {
            expect(DateTime.dateBetween(
                new Date(),
                DateTime.addDays(new Date(), 1),
                DateTime.addDays(new Date(), -1),
            )).toEqual(true)
        })
    })

    describe('min', function () {
        const dates = [
            '2019-12-31',
            '2019-11-01',
            '2019-02-02 23:59:59',
            '2019-02-02 23:59:50',
        ].map(string => new Date(string))

        it('should return the earliest date', function () {
            expect(DateTime.min(...dates)).toEqual(new Date('2019-02-02 23:59:50'))
        })

        it('should ignore non-dates', function () {
            const datesAndOthers: any[] = [ ...dates, 'foo', null, undefined, 0 ]
            expect(DateTime.min(...datesAndOthers)).toEqual(new Date('2019-02-02 23:59:50'))
        })

        it('should return false if only non-dates have been passed', function () {
            const values: any[] = [ 1, 2, null, undefined ]
            expect(DateTime.min(...values)).toEqual(false)
        })
    })

    describe('max', function () {
        const dates = [
            '2019-02-02 23:59:59',
            '2019-02-02 23:59:50',
            '2018-12-31'
        ].map(string => new Date(string))

        it('should return the latest date', function () {
            expect(DateTime.max(...dates)).toEqual(new Date('2019-02-02 23:59:59'))
        })

        it('should ignore non-dates', function () {
            const datesAndOthers: any[] = [ ...dates, 'foo', null, undefined, 0 ]
            expect(DateTime.max(...datesAndOthers)).toEqual(new Date('2019-02-02 23:59:59'))
        })

        it('should return false if only non-dates have been passed', function () {
            const values: any[] = [ 1, 2, null, undefined ]
            expect(DateTime.max(...values)).toEqual(false)
        })
    })
})
