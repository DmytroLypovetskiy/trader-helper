import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import './styles.scss';
import { Login } from './components';


class App extends Component {
  render() {
    return (
      <HashRouter>
        <section className="container-fluid p-5 mb-5 rounded qwe">

          <Login />
        </section>
      </HashRouter >
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));