import React, { Component } from 'react'
import axios from 'axios';
const API = "http://localhost:5000";
const finAPI = "https://finnhub.io/api/v1";
import { BuyForm, StockInfo } from './index';
import { Link } from 'react-router-dom';

export default class Dashboard extends Component {
  state = {
    stocks: [],
    watchlist: [],
    news: []
  }
  async componentDidMount() {
    const { data: { stocks, watchlist } } = await axios.get(`${API}/api/profile`);

    //delete axios.defaults.headers.common['x-auth-token'];
    const promise = axios.create({});
    promise.defaults.headers.common = {};
    promise.defaults.headers.common.accept = 'application/json';

    const { data } = (await promise.get(`${finAPI}/quote?symbol=AAPL&token=br8k8g7rh5ral083hgd0`));

    this.setState({ stocks, watchlist })
  }
  updateStocks = (symbol, qty) => {
    console.log(this.state.stocks[0]);

    this.setState({ stocks: [this.state.stocks[0]] })
  }
  logout = () => {
    localStorage.removeItem('token');
  }
  render() {
    const { stocks, watchlist } = this.state;

    return (
      <>
        <div className="d-flex justify-content-between">
          <h1 className="h4">Dashboard</h1>
          <div><Link to="/" className="btn btn-outline-primary btn-sm" onClick={this.logout}>Logout</Link></div>
        </div>
        <div className="row pt-3">
          <div className="col-lg-9 col-md-6">
            <div className="card p-3 mb-3">
              <h2 className="h5">My Stocks</h2>
              <BuyForm stocks={stocks} updateStocks={this.updateStocks} />
              {stocks &&
                <ul className="list-unstyled pt-3 stocks-list">
                  {stocks.map(stock => {
                    return <StockInfo key={stock._id} stock={stock} />
                  })}
                </ul>
              }
            </div>

            <div className="card p-3 mb-3">
              <h2 className="h5">Watchlist</h2>
            </div>

          </div>
          <div className="col-lg-3 col-md-6 d-flex">
            <div className="card p-3 flex-grow-1 mb-3">
              <h2 className="h5">News</h2>
            </div>
          </div>
        </div>
      </>
    )
  }
}
