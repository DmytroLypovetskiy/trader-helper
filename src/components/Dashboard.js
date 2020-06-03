import React, { Component } from 'react'
import axios from 'axios';
const API = "http://localhost:5000";
const finAPI = "https://finnhub.io/api/v1";
import { BuyForm, StockInfo } from './index';

export default class Dashboard extends Component {
  state = {
    stocks: [],
    watchlist: [],
    news: []
  }
  async componentDidMount() {
    const { data } = await axios.get(`${API}/api/profile`);
    const { stocks, watchlist } = data;

    //delete axios.defaults.headers.common['x-auth-token'];

    const promise = axios.create({});
    promise.defaults.headers.common = {};
    promise.defaults.headers.common.accept = 'application/json';

    const stock = (await promise.get(`${finAPI}/quote?symbol=AAPL&token=br8k8g7rh5ral083hgd0`)).data;
    console.log(stock);

    console.log(axios.defaults.headers.common)

    this.setState({ stocks, watchlist })
  }
  render() {
    const { stocks, watchlist } = this.state;

    return (
      <>
        <h1 className="h3">Dashboard</h1>
        <div className="row pt-3">
          <div className="col-lg-9 col-md-6">
            <div className="card p-3 mb-3">
              {/*
              <ul className="nav justify-content-center">
                <li className="nav-item">
                  <a className="nav-link active" href="#">My stocks</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Transactions</a>
                </li>
              </ul>
              */}
              <h2 className="h5">My Stocks</h2>
              <BuyForm />
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
