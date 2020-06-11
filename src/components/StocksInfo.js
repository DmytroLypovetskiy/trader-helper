import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from '../utils/setAuthToken';
import Moment from 'react-moment';
import { SellForm } from './index';
import TradingViewWidget from 'react-tradingview-widget';

class StockInfo extends Component {
  state = {
    stocks: []
  }
  setFieldToState = (e) => {
    this.setState({ [e.target.name]: e.target.value })
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

    return (
      <ul className="list-unstyled pt-3 stocks-list">
        {stocks.map(({ symbol, transactions }) => {
          return <li className="row mb-3" key={symbol}>
            <div className="col-lg-5">
              <p className="d-flex justify-content-between"><strong className="h4">{symbol}</strong> <span> <small>stock(s)</small></span></p>
              <p className="small text-muted">active purchases:</p>
              <table className="table table-sm table-hover small">
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>USD(e/a)</th>
                    <th><span className="text-success">+</span>/<span className="text-danger">-</span></th>
                    <th>Sell: Qty | Price</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(({ purchaseId, qty, price }) => {
                    return <tr key={purchaseId}>
                      <td>{qty}</td>
                      <td>{price}</td>
                      <td></td>
                      <td>
                        <SellForm stock={{ symbol, purchaseId, qty }} updateTransaction={this.props.updateTransaction} />
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-lg-7">

              <TradingViewWidget
                symbol="NYSE:BA"
                interval="D"
                autosize
              />

            </div>
          </li>
        })}

      </ul>
    )
  }
}

export default StockInfo;