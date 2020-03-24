import React, { FunctionComponent } from 'react'
import { DateTimeRangePickerControlled } from '../../src'
import { updateOverlayPosition } from '../../src/Components/Overlay/OverlayHelper'
import { Options, PositioningCallback } from '../../src/Context/contextOptions'
import { withRangeController } from '../../src/Controller/WithRangeController'

// Example positioning callback
const onUpdatePosition: PositioningCallback = ((overlayRef, relativeRef) => {
    console.log(
        'Dynamic Popup Positioning: options.position()',
        { overlay: overlayRef.current, relative: relativeRef.current }
    )

    // This calls the default behaviour of this plugin but if you want to take full control of
    // the calendar overlay position, just replace this line and apply your styles to the overlay ref.
    updateOverlayPosition([ 'center', 'down' ], overlayRef, relativeRef)
})

// Setting the onUpdatePosition callback as position option will disable the plugins
// default positioning and handover the control to the callback.
const options: Options = { position: onUpdatePosition }

const onChange = (start: Date | null, end: Date | null) =>
    console.log('Dynamic Popup Positioning: onChange', { start, end })

const RangePicker = withRangeController(DateTimeRangePickerControlled)
export const DynamicPopupPositioning: FunctionComponent = () => (
    <RangePicker onChange={ onChange } options={ options }>
        <button>Dynamic Popup Positioning</button>
    </RangePicker>
)
