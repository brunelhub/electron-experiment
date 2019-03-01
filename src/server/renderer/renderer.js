/**
 * Temporary file just to test the server-side rendering with viperHTML
 */

'use strict';

// ---- node modules
const viperHTML = require('viperhtml');

// ---- local variables
const view = {
  window: require('../../client/component/window.js'),
  item: require('../../client/component/item.js'),
  button: require('../../client/component/button.js'),
};

module.exports = {
  // async wires - parent
  window: (chunks, model) => view.window(
    viperHTML.async()(chunks),
    model
  ),

  // async wires - children
  // item: (model) => view.item(
  //   viperHTML.async(model)(),
  //   model
  // )
  item: (model) => view.item(
    viperHTML.wire(model),
    model
  ),

  button: (model) => view.button(
    viperHTML.wire(model),
    model
  )

};

