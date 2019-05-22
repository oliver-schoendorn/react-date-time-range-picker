'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/cjs/date-time-range-picker.min.js');
} else {
    module.exports = require('./dist/cjs/date-time-range-picker.js');
}
