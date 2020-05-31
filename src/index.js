import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import './styles.scss';
import { Login, Dashboard } from './components';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends Component {
  render() {
    return (
      <HashRouter>
        <section className="container-fluid p-3 mb-3">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/dashboard' component={Dashboard} />
          </Switch>
        </section>
      </HashRouter >
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));