import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from '../utils/setAuthToken';
import Moment from 'react-moment';

class StockInfo extends Component {
  state = {
    stocks: []
  }
  async componentDidMount() {
    const { stocks } = this.props;

    this.setState({ stocks })
  }
  componentDidUpdate(prev) {
    const { stocks } = this.props;

    if (prev.stocks.length !== stocks.length) {
      this.setState({ stocks });
    }
  }
  render() {
    /** TODO it call 4 times! **/

    const { stocks } = this.state;
    console.log(stocks);
    return (
      <ul className="list-unstyled pt-3 stocks-list">
        {Object.entries(stocks).map(stock => {
          console.log(stock);
          return <li className="row mb-3" key={stock[0]}>
            <div className="col-lg-5">
              <p className="d-flex justify-content-between"><strong className="h4">{stock[0]}</strong> <span> <small>stock(s)</small></span></p>
              <p className="small text-muted">purchases:</p>
            </div>

          </li>
        })}
        <li className="row mb-3">
          <div className="col-lg-5">
            <table className="table table-sm table-hover small">
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>Price e/a</th>
                  <th>Date</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
          <div className="col-lg-7">
            chart
        </div>

        </li>
      </ul>
    )
  }
}

export default StockInfo;