# jsx-tmpl
Build JSX using native ES6 templates. No transpiling required for Node.js and modern browsers.

* Returns strings for fast rendering on the server
* Returns a full JSX virtual DOM on the client

## Features

* *Valid ES6 syntax* (no transpiling required for Node and modern browsers)
* Caches JSX compilation for consecutive render() calls (so the HTML string is not converted to JSX on each render)
* Converts HTML properties like "class" and "for" to required "className" and "htmlFor" for React
* Use with *any React-compatible framework* (React, Preact, Inferno, etc.) or virtual DOM library

## Installation

```
npm i jsx-tmpl --save
```

## Usage

Just use the `jsx` tagged template literal and write normal HTML markup inside native ES6 templates.

```javascript
const { jsx } = require('jsx-tmpl');
const Greeting = require('./Greeting');
const React = require('react');

class App extends React.PureComponent {
  render() {
    return jsx`
      <div class="App">
        <Greeting name="John Doe" />
      </div>
    `(React, { Greeting }); // Pass in React, and a hash of components used
  }
}
```

### Passing Variables / Props

For dynamic props or rendering variables, use standard ES6 template interpolation:

```javascript
const { jsx } = require('jsx-tmpl');
const Greeting = require('./Greeting');
const React = require('react');

class App extends React.PureComponent {
  render() {
    let name = "John Doe";

    return jsx`
      <div class="App">
        <Greeting name=${name} />
      </div>
    `(React, { Greeting }); // Pass in React, and a hash of components used
  }
}
```

### Usage with Preact

Since React is passed in as a parameter to the resulting render function, you
can substitute it for [Preact](https://preactjs.com/), or any other virtual DOM
library or React-compatible framework.

```javascript
const { jsx } = require('jsx-tmpl');
const Preact = require('preact');

class App extends Preact.Component {
  render() {
    let name = "John Doe";

    return jsx`
      <div class="App">
        Hell World!
      </div>
    `(Preact); // Pass in Preact instead of React!
  }
}
```
