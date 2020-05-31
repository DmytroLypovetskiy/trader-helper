import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from './../utils/setAuthToken';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    isAuthenticated: !!localStorage.getItem('token')
  }
  setFieldToState = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  loginUser = async (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    const { data } = await axios.post(`${API}/api/auth`, { email, password });

    if (data) {
      localStorage.setItem('token', data.token);
      this.setState({ isAuthenticated: true })
    }

  }
  render() {
    const { email, password, isAuthenticated } = this.state;
    // Redirect if logged in

    if (isAuthenticated) {
      return <Redirect to="/dashboard" />
    }

    return (
      <div className="card p-5 col-md-6 m-auto">
        <form onSubmit={this.loginUser}>
          <h1>Login User</h1>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control rounded-pill" name="email"
              value={email}
              onChange={(e) => this.setFieldToState(e)}
              placeholder="Email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control rounded-pill" name="password"
              value={password}
              onChange={(e) => this.setFieldToState(e)}
              id="inputPassword" required />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-primary rounded-pill">Login</button>
            <div>Don't have an account? <Link to="">Register</Link></div>
          </div>
        </form>
      </div>
    )
  }
}

export default Login;