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

    if (typeof value === 'function') {
      let componentName = getNameFromFunction(value);

      propsMap[componentName] = value;

      valueString = componentName;
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

    // console.log('render result =', result);

    return result;
  }
}

/**
 * Get name from given React component or function
 *
 * @param {function} value
 * @return {string}
 */
function getNameFromFunction(value) {
  let componentName = (value.name || value.constructor.name || 'func') + '_' + randomString(25);

  return componentName;
}

/**
 * Generate a random string
 *
 * @param {number} length
 * @return {string}
 */
function randomString(length = 20) {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

module.exports = {
  jsx,
};
