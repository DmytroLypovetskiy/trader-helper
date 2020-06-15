import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
  state = {
    isAuthenticated: !!localStorage.getItem('token')
  }
  render() {
    const { component: Component, ...rest } = this.props;
    const { isAuthenticated } = this.state;

    return (
      <Route
        {...rest}
        render={props =>
          !isAuthenticated ?
            <Redirect to='/' />
            :
            <Component {...props} />
        }
      />
    )
  }
}

export default PrivateRoute;