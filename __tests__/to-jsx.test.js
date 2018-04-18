const { jsx } = require('../src');
require('../src/testConfig'); // Enzyme setup
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { mount, shallow } = require('enzyme');

// Helpers
const element = React.createElement;
const toString = ReactDOMServer.renderToStaticMarkup;

describe('toJSX on client', () => {

  it('should convert a single HTML tag to JSX', () => {
    let Component = () => jsx`<div>Test</div>`(React);
    let wrapper = shallow(element(Component));

    expect(wrapper.html()).toEqual('<div>Test</div>');
  });

  it('should convert a nested component tag to corresponding JSX', () => {
    let ListItem = () => jsx`<li>List item</li>`(React);
    let ParentComponent = () => jsx`<ul><ListItem key="listitem" /></ul>`(React, { ListItem });
    let wrapper = mount(element(ParentComponent));

    expect(wrapper.html()).toEqual('<ul><li>List item</li></ul>');
  });

  it('should pass "children" as props down to child components', () => {
    let ListItem = (props) => jsx`<li>${props.children}</li>`(React);
    let List = (props) => jsx`<ul><ListItem key="listitem">Test</ListItem></ul>`(React, { ListItem });
    let wrapper = mount(element(List));

    expect(wrapper.html()).toEqual('<ul><li>Test</li></ul>');
  });

  it('should be able to handle a function onClick attribute', () => {
    let clickCount = 0;
    let onClick = () => ++clickCount;
    let Component = () => jsx`<a id="link" onClick=${onClick}>Click Me</a>`(React);
    let wrapper = mount(element(Component));

    wrapper.find('#link').simulate('click');

    expect(clickCount).toEqual(1);
  });

  it('should be able to handle numeric props', () => {
    let actual;
    let expected = 2;
    let Component = (props) => { actual = props.test; return null };
    let ParentComponent = () => jsx`<Component test=${expected} />`(React, { Component });
    let wrapper = mount(element(ParentComponent));

    expect(actual).toEqual(expected);
  });

  it('should be able to handle boolean props', () => {
    let actual;
    let expected = false;
    let Component = (props) => { actual = props.test; return null };
    let ParentComponent = () => jsx`<Component test=${expected} />`(React, { Component });
    let wrapper = mount(element(ParentComponent));

    expect(actual).toEqual(expected);
  });

  it('should be able to handle object props', () => {
    let actual;
    let expected = { backgroundColor: 'blue' };
    let Component = (props) => { actual = props.test; return null };
    let ParentComponent = () => jsx`<Component test=${expected} />`(React, { Component });
    let wrapper = mount(element(ParentComponent));

    expect(actual).toEqual(expected);
  });

  it('should be able to handle object styles', () => {
    let actual;
    let expected = { backgroundColor: 'blue' };
    let Component = () => jsx`<div style=${expected} />`(React);
    let wrapper = mount(element(Component));

    expect(wrapper.html()).toEqual('<div style="background-color: blue;"></div>');
  });

});

describe('jsx render cache', () => {

  it('should return a cached function the second render so the HTML string will not have to be parsed every render', () => {
    let renderFn = () => jsx`<div>Cache Test</div>`;
    let result1 = renderFn(); // 1st call

    expect(result1.fromCache).toBe(undefined);

    let result2 = renderFn(); // 2nd call (should be from cache)

    expect(result2.fromCache).toBe(true);
  });

  it('should properly pass props with render cache', () => {
    let actual;
    let expected = false;
    let Component = (props) => { actual = props.test; return null };
    let ParentComponent = () => jsx`<Component test=${expected} />`(React, { Component });

    mount(element(ParentComponent));
    mount(element(ParentComponent));

    expect(actual).toEqual(expected);
  });

});
