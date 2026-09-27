'use strict';

// Every series folder that shares this engine, relative to the repository root. The shared
// test suite and the CI workflow both loop over this list so a new series is covered
// automatically as soon as it is registered here — see the taiwan-ehon and japan-ehon READMEs
// for what a series folder must contain.
module.exports = ['taiwan-ehon', 'japan-ehon'];
