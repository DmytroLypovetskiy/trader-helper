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
    let { stocks } = this.props;

    stocks = this.updateData(stocks);
    this.setState({ stocks })
  }
  componentDidUpdate(prev) {
    let { stocks } = this.props;

    if (prev.stocks.length !== stocks.length) {
      stocks = this.updateData(stocks);

      this.setState({ stocks });
    }
  }
  updateData = (data) => {
    const stocks = [];
    const symbols = {};

    data.forEach(({ _id, symbol, price, qty, transaction }) => {
      if (symbols.hasOwnProperty(symbol)) {
        symbols[symbol].push({ _id, price, qty, transaction });
      } else {
        symbols[symbol] = [{ _id, price, qty, transaction }]
      }
    });

    for (let key in symbols) {
      stocks.push({
        symbol: key,
        transactions: symbols[key]
      })
    }
    return stocks;
  }
  render() {
    /** TODO it call 4 times! **/
    const { stocks } = this.state;
    //console.log(stocks)

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
                    <th>$(e/a)</th>
                    <th><span className="text-success">+</span>/<span className="text-danger">-</span></th>
                    <th>Sell: Qty | Price</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(({ _id, qty, price, transaction }) => {
                    return <tr key={_id}>
                      <td>{qty}</td>
                      <td>{price}</td>
                      <td></td>
                      <td>
                        <SellForm stock={{ symbol, _id, qty, transaction }} updateTransaction={this.props.updateTransaction} />
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-lg-7">

              <TradingViewWidget
                symbol={`NYSE:${symbol}`}
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