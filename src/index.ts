import { ComponentType } from 'react'
import * as DateTimeHelper from './Helper/DateTime'
import { DateTimeRangePickerControlled } from './Components/DateTimeRangePickerControlled'
import { withRangeController, Props as DateTimeRangePickerProps } from './Controller/WithRangeController'
import { withController, Props as DateTimePickerProps } from './Controller/WithController'
import './Styles/DateTimeRangePicker.scss'
import { Options } from './Context/contextOptions'
import { BaseController, BaseControllerProps } from './Controller/Controller'

const DateTimePicker: ComponentType<DateTimePickerProps> = withController(DateTimeRangePickerControlled)
const DateTimeRangePicker: ComponentType<DateTimeRangePickerProps> = withRangeController(DateTimeRangePickerControlled)

export {
    DateTimePicker,
    DateTimeRangePicker,
    DateTimeRangePickerControlled,
    BaseController as DateTimeRangePickerController,
    DateTimeHelper,
}

export type {
    DateTimePickerProps,
    DateTimeRangePickerProps,
    BaseControllerProps as DateTimeRangePickerControllerProps,
    Options as DateTimePickerOptions,
}
