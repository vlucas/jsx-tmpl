# jsx-tmpl
Build JSX using native ES6 templates. No transpiling required for Node.js and modern browsers.

* Returns strings for fast rendering on the server
* Returns a full JSX virtual DOM on the client

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

## Notes
* **React v16.x or higher ONLY**. Previous version of react do not support rendering strings (for server rendering).
* Alpha stability: This should not be used in production _yet_, as the client-side JSX gerneation is not cached or memoized yet, and thus is very likely to have slow client render times
