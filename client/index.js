import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  state = {
    stocks: [],
    total: 0,
    watchlist: []
  }

  render() {
    return (

      <h2>Dashboard</h2>

    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app')); KBK18Z7hlg6nVhBY