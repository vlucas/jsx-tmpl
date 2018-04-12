const client = require('./client');
// const server = require('./server');

// const IS_NODE = typeof module !== 'undefined' && this.module !== module;
// const IS_BROWSER = !IS_NODE;

/**
 * Render template value as string
 *
 * @param {String} value
 * @return {string}
 */
function templateValueToJSX(value) {
  if (value === undefined || value === null) {
    return '';
  }

  // Handle arrays of sub-data
  if (value instanceof Array) {
    let values = value.map(val => templateValueToJSX(val));

    return values.join('');
  }

  return value.toString();
}

/**
 * ES6 tagged template literal function
 *
 * @param {String[]} string parts
 * @return {Function}
 */
function jsx(strings, ...values) {
  let output = '';
  let index = 0;
  let propsMap = {};

  for (index = 0; index < values.length; index++) {
    let value = values[index];
    let valueString;

    if (typeof value !== 'string') {
      let propPlaceholder = getPropPlaceholder(value);

      propsMap[propPlaceholder] = value;

      valueString = propPlaceholder;
    }

    if (valueString === undefined) {
      valueString = templateValueToJSX(value);
    }

    output += strings[index] + valueString;
  }

  output += strings[index];

  output = output.trimRight();

  return jsxTmplResult(output, propsMap);
}

/**
 * Return render function for components
 */
function jsxTmplResult(output, propsMap) {
  return function (vdom, componentMap) {
    const h = vdom.h || vdom.createElement;

    let result = client.render(h, output, propsMap, componentMap);

    return result;
  }
}

/**
 * Get name from given React component or function
 *
 * @param {function} value
 * @return {string}
 */
let propIncrement = 0;
function getPropPlaceholder(value) {
  let propName = (value.name || value.constructor.name || typeof value) + '_' + ++propIncrement;

  return propName;
}

module.exports = {
  jsx,
};
