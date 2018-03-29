# jsx-tmpl
Build JSX using native ES6 templates. No transpiling required for Node.js and modern browsers.

* Returns strings for fast rendering on the server
* Returns a full JSX virtual DOM on the client

## Usage

Just use the `jsx` tagged template literal and write normal HTML markup inside native ES6 templates.

```javascript
const { jsx } = require('jsx-native');
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

## Notes
* **React v16.x or higher ONLY**. Previous version of react do not support rendering strings (for server rendering).
* Alpha stability: This should not be used in production _yet_, as the client-side JSX gerneation is not cached or memoized yet, and thus is very likely to have slow client render times
