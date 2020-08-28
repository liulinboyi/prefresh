const { flush, compareSignatures: compare } = require('@prefresh/utils');
const flushUpdates = flush;
const compareSignatures = compare;
exports.compareSignatures = compareSignatures;
exports.flushUpdates = flushUpdates;
