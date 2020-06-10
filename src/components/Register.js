import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from '../utils/setAuthToken';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    isAuthenticated: !!localStorage.getItem('token')
  }
  setFieldToState = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  registerUser = async (e) => {
    e.preventDefault();

    const { name, email, password } = this.state;
    const { data } = await axios.post(`${API}/api/user`, { name, email, password });

    if (data) {
      localStorage.setItem('token', data.token);
      this.setState({ isAuthenticated: true })
    }

  }
  render() {
    const { name, email, password, isAuthenticated } = this.state;
    // Redirect if logged in

    if (isAuthenticated) {
      return <Redirect to="/dashboard" />
    }

    return (
      <div className="card p-5 col-md-6 m-auto">
        <form onSubmit={this.registerUser}>
          <h1>Register User</h1>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="name" className="form-control rounded-pill" name="name"
              value={name}
              onChange={(e) => this.setFieldToState(e)}
              placeholder="Name" required />
          </div>
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
            <button type="submit" className="btn btn-primary rounded-pill">Register</button>
            <div>Have an acccount? <Link to="/">Login</Link></div>
          </div>
        </form>
      </div>
    )
  }
}

export default Register;