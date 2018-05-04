const htmlparser = require('htmlparser2');
let tagKey = 0;

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
    return obj
      .filter(t => t)
      .map(tag => traverseToVdom(h, tag, propsMap, componentMap));
	}

  if (!obj) {
    return;
  }

	var type = obj.type,
		tagName = obj.name,
		children = obj.children,
		comp;

  delete obj.next;
  delete obj.prev;
  delete obj.parent;

	if (type == 'tag') {
    let attributes = attrs(obj.attribs);

    // Map specified components to their respective passed-in React components by name
    let tagComponentKey = Object.keys(componentMap).find(key => key === tagName || key.toLowerCase() === tagName);

    if (tagComponentKey) {
      tagName = componentMap[tagComponentKey];
      delete componentMap[tagComponentKey];
    }

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

    // Check for placeholders in string children
    children = children.map(child => {
      let data = child.data;

      if (typeof data !== 'string') {
        return child;
      }

      if (propsMap[data]) {
        child.data = propsMap[data];
        delete propsMap[data];
      }

      return child;
    });

    // Always use a key if not present
    if (attributes.key === undefined) {
      attributes.key = '__jsx-tmpl-key-' + (++tagKey);
    }

    let nodeChildren = children.map(c => traverseToVdom(h, c, propsMap, componentMap));

    comp = h(tagName, attributes, nodeChildren.length > 0 ? nodeChildren : null);
	} else if (type == 'text' ) {
		comp = replacePropsInTextNode(obj.data, propsMap);
	}

	return comp;
}

function replacePropsInTextNode(text, props) {
  let propKeys = Object.keys(props);
  let textParts = [];

  propKeys.forEach(key => {
    if (text.includes(key)) {
      keyParts = text.split(key);
      keyParts.splice(1, 0, props[key]);

      textParts = textParts.concat(keyParts);
      delete props[key];
    }
  });

  // No placeholders found in text
  if (textParts.length === 0) {
    textParts = [text];
  }

  // Return text parts trimmed and cleaned up
  return textParts
    .map(text => {
      if (typeof text !== 'string') {
        return text;
      }

      return text
        .replace('\n', '')
        .replace(/\s+/g, ' ');
    })
    .filter(t => t);
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
