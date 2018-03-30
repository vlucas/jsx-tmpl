const htmlparser = require('htmlparser2');

/**
 * Render for the client (build a virtual DOM)
 *
 * @param {React|Preact|Inferno|vdom} h - Any React-compatable API or virtual dom
 * @param {string} html - HTML string to parse
 * @param {string} propsMap - Hash of prop { name: value } to replace on parse
 * @param {string} componentMap - Hash of components { name: Component } to replace  matching tagName with on parse
 * @return {Object} Virtual DOM
 */
function render(h, html, propsMap = {}, componentMap = {}) {
  return traverseToVdom(h, parseHTMLToDOM(html), propsMap, componentMap);
}

/**
 * Parse HTML to DOM tree (via htmlparser2)
 *
 * @param {string} html - HTML string to parse
 * @return {Object} HTML node hierarchy tree
 */
function parseHTMLToDOM(html) {
  let parseOptions = {
    lowerCaseAttributeNames: false,
    lowerCaseTags: false,
  };

  let handler = new htmlparser.DomHandler();
  let parser = new htmlparser.Parser(handler, parseOptions);

  parser.parseComplete(html, parseOptions);

  return handler.dom;
}

/**
 * Render for the client (build a virtual DOM)
 *
 * @param {React|Preact|Inferno|vdom} h - Any React-compatable API or virtual dom
 * @param {string} obj - DOM hierarchy tree
 * @param {string} propsMap - Hash of prop { name: value } to replace on parse
 * @param {string} componentMap - Hash of components { name: Component } to replace  matching tagName with on parse
 * @return {Object} Virtual DOM Node
 */
function traverseToVdom(h, obj, propsMap = {}, componentMap = {}) {
	if (Array.isArray(obj)) {
		obj = obj[0];
	}

	var type = obj.type,
		tagName = obj.name,
		children = obj.children,
		comp,
		tagArray = [tagName];

	if (type == 'tag') {
    let attributes = attrs(obj.attribs);

    // Map specified components to their respective passed-in React components by name
    let tagComponentKey = Object.keys(componentMap).find(key => key === tagName || key.toLowerCase() === tagName);

    if (tagComponentKey) {
      tagName = componentMap[tagComponentKey];
      delete componentMap[tagComponentKey];
    }

    console.log('[client] building element with props =', propsMap);

    // Check props for things in propsMap
    Object.keys(attributes).forEach(function(key) {
      let value = attributes[key];
      let propKey = Object.keys(propsMap).find(key => key === value);

      // Replace attribute value with passed in value
      // NOTE: this is typically for function references
      if (propKey) {
        attributes[key] = propsMap[propKey];
        delete propsMap[propKey];
      }
    });

    comp = h(tagName, attributes, children.map(c => traverseToVdom(h, c, propsMap, componentMap)));
	} else if (type == 'text' ) {
		comp = obj.data;
	}

	return comp;
}

/**
 * Build attribtues object
 *
 * @param {Object} obj
 * @return {Object}
 */
function attrs(obj) {
	if (isEmptyObject(obj)) {
		return {};
	}

	var key,
		attribObj = {},
		regularKeys = /(data-||aria-)?/;

	for (key in obj) {
		if (key == 'class') {
			attribObj.className = obj[key];
		} else if (key.match(regularKeys)[1]) {
			attribObj[key] = obj[key];
		} else if (key == 'for') {
			attribObj.htmlFor = obj[key];
		} else {
			attribObj[key] = obj[key];
		}
	}

	return attribObj;
}

/**
 * Is empty object?
 *
 * @param {Object} obj
 * @return {Object}
 */
function isEmptyObject(obj) {
	return Object.getOwnPropertyNames(obj).length === 0;
}

module.exports = {
  render,
};
