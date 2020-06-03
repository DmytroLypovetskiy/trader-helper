import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from '../utils/setAuthToken';

class StockInfo extends Component {

  render() {
    const { stock } = this.props;

    return (
      <li className="row mb-3">
        <div className="col-lg-4">
          <p className="d-flex justify-content-between"><strong className="h4">{stock.symbol}</strong> <span> {stock.qty} <small>stock(s)</small></span></p>
          <p><small>bought:</small> <small>$</small><strong>{stock.boughtFor}</strong></p>
          <p><span className="btn badge badge-light">102%</span></p>
          <p><span className="btn badge badge-success">136%</span></p>
          <p><span className="btn badge badge-danger">71%</span></p>
        </div>
        <div className="col-lg-4">
          rewv
        </div>
      </li>
    )
  }
}

export default StockInfo;