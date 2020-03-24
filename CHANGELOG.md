# Changelog

## v1.0.0

- adds optional callback option for customized overlay positioning
- changes `onChange` controller prop signatures: The `start` and `end` values may be a `Date` instance or `null`
- adds optional controller prop `onUpdateSelection?(startDate: Date | null, endDate: Date | null)` to listen for selection updates
- updates npm dependencies

## v0.0.8

- fixes an issue that causes the picker to crash when no `constraint.minDate` is set (fixes #1)

## v0.0.7

- fixes an issue that could cause the overlay to close when changing months
- fixes overlay positioning (adds scroll offsets)
- adds missing ESM dependencies
