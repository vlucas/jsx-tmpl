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
    let wrapper = mount(element(Component));

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

  it('should be able to render default create-react-app markup', () => {
    class App extends React.Component {
      render() {
        let logo = 'img/logo.png';

        return jsx`
          <div className="App">
            <header className="App-header">
              <img src=${logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        `(React);
      }
    }

    // let wrapper = mount(element(App));
    let html = toString(element(App));

    expect(html).toEqual('<div class="App"><header class="App-header"><img src="img/logo.png" class="App-logo" alt="logo"/><h1 class="App-title">Welcome to React</h1></header><p class="App-intro">To get started, edit<code>src/App.js</code>and save to reload.</p></div>');
  });

});

describe('React renderToStaticMarkup', () => {
  it('should render component to static markup', () => {
    let actual;
    let expected = { backgroundColor: 'blue' };
    let Component = () => jsx`<div style=${expected} />`(React);
    let html = toString(element(Component));

    expect(html).toEqual('<div style="background-color:blue"></div>');
  });

  it('should render component to static markup that equals React.createElement()', () => {
    let actual;
    let expected = { backgroundColor: 'blue' };
    let Component = () => jsx`<div style=${expected} />`(React);
    let Component2 = () => element('div', { style: expected });
    let html1 = toString(element(Component));
    let html2 = toString(element(Component2));

    expect(html1).toEqual(html2);
  });

  it('should render toString', () => {
    let actual;
    let expected = { backgroundColor: 'blue' };
    let Component = () => jsx`<div style=${expected} />`(React);
    let html = toString(Component());

    expect(html).toEqual('<div style="background-color:blue"></div>');
  });
});

describe('jsx render cache', () => {

  it('should render twice with different prop values (from cache 2nd time)', () => {
    let renderFn = (props) => jsx`<div>Cache Test ${props.number}</div>`(React);
    let result1 = renderFn({ number: 1 }); // 1st call
    let result2 = renderFn({ number: 2 }); // 2nd call (should be from cache)

    let html1 = toString(result1);
    let html2 = toString(result2);

    expect(html2).not.toEqual(html1);
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
