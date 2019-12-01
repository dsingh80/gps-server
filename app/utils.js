/**
 * @file utils.js
 * @fileOverview Utility functions for miscellaneous uses
 */
'use strict';


/**
 * Cache busting utility function for modules
 * Module paths should always be relative to the location of the utils.js file
 * @param module  Path to the module RELATIVE TO THIS FILE
 * @returns {module}
 */
module.exports.requireUncached = function(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
};