import React, { Component } from 'react'
import axios from 'axios';
const API = "http://localhost:5000";
const finAPI = "https://finnhub.io/api/v1";
import { BuyForm, StocksInfo } from './index';
import { Link } from 'react-router-dom';

export default class Dashboard extends Component {
  state = {
    name: '',
    stocks: [],
    watchlist: [],
    news: []
  }
  async componentDidMount() {
    const { data: { stocks, watchlist } } = await axios.get(`${API}/api/profile`);
    const { data: { name } } = await axios.get(`${API}/api/auth`);

    //delete axios.defaults.headers.common['x-auth-token'];
    const promise = axios.create({});
    promise.defaults.headers.common = {};
    promise.defaults.headers.common.accept = 'application/json';

    //const { data } = (await promise.get(`${finAPI}/quote?symbol=AAPL&token=br8k8g7rh5ral083hgd0`));

    const orderBySymbol = {};

    /* 
    
      "BA": [{qty: 10, transactionId: "5edc1454a208"}, {qty: 10, transactionId: "5edc1454a208"}],
      "GE": [{qty: 10, transactionId: "5edc1454a208"}, {qty: 10, transactionId: "5edc1454a208"}]
    */

    stocks.forEach(stock => {
      const { symbol, qty, transactionId } = stock;

      if (orderBySymbol.hasOwnProperty(symbol)) {
        orderBySymbol[symbol].push({ qty, transactionId });
      } else {
        orderBySymbol[symbol] = [{ qty, transactionId }]
      }
    });

    this.setState({ name, stocks: orderBySymbol, watchlist })
  }
  updateStocks = (symbol, qty) => {
    /*
    console.log(this.state.stocks[0]);

    this.setState({ stocks: [this.state.stocks[0]] })
    */
  }
  logout = () => {
    localStorage.removeItem('token');
    this.setState({ name: '' })
  }
  render() {
    const { name, stocks, watchlist } = this.state;

    return (
      <>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <h1 className="h4">Dashboard</h1>
            <div className="text-muted mx-2">/ <i className="fas fa-user"></i> Hello <strong>{name}!</strong></div>
          </div>
          <div><Link to="/" className="btn btn-outline-primary btn rounded-circle px-2" onClick={this.logout}><i className="fas fa-door-open"></i></Link></div>
        </div>
        <div className="row pt-3">
          <div className="col-lg-9 col-md-6">
            <div className="card p-3 mb-3">
              <h2 className="h5">My Stocks</h2>
              <BuyForm updateStocks={this.updateStocks} />
              <StocksInfo stocks={stocks} />
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
