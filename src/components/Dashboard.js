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
    const { data: { name } } = await axios.get(`${API}/api/auth`);
    const { data: { watchlist, news } } = await axios.get(`${API}/api/profile`);
    const stocksData = (await axios.get(`${API}/api/stocks`)).data;

    const stocks = stocksData.map(({ price, qty, symbol, _id, transaction }) => {
      return { price, qty, symbol, _id, transaction }
    });

    //delete axios.defaults.headers.common['x-auth-token'];
    const promise = axios.create({});
    promise.defaults.headers.common = {};
    promise.defaults.headers.common.accept = 'application/json';

    //const { data } = (await promise.get(`${finAPI}/quote?symbol=AAPL&token=br8k8g7rh5ral083hgd0`));
    this.setState({ name, stocks, watchlist, news })
  }
  addTransaction = (stock) => {
    const { stocks } = this.state;

    this.setState({ stocks: [stock, ...stocks] })
  }
  updateTransaction = ({ transaction, qty }) => {
    const { stocks } = this.state;

    const updStocks = stocks
      .map(stock => {
        if (stock.transaction === transaction) {
          stock.qty -= qty;
        }
        return stock;
      })
      .filter(stock => stock.qty !== 0);
    console.log(stocks);
    console.log(updStocks);


    this.setState({ stocks: updStocks })
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
          <div className="d-flex align-items-center dashboard-header">
            <h1 className="h4">Dashboard</h1>
            <div className="text-muted mx-2">/ <i className="fas fa-user"></i> Hello <strong>{name}!</strong></div>
          </div>
          <div><Link to="/" className="btn btn-outline-primary btn rounded-circle px-2" onClick={this.logout}><i className="fas fa-door-open"></i></Link></div>
        </div>
        <div className="row pt-3">
          <div className="col-md-9">
            <div className="card p-3 mb-3">
              <h2 className="h5">My Stocks</h2>
              <BuyForm addTransaction={this.addTransaction} />
              <StocksInfo stocks={stocks} updateTransaction={this.updateTransaction} />
            </div>

            <div className="card p-3 mb-3">
              <h2 className="h5">Watchlist</h2>
            </div>

          </div>
          <div className="col-md-3 d-flex">
            <div className="card p-3 flex-grow-1 mb-3">
              <h2 className="h5">News</h2>
            </div>
          </div>
        </div>
      </>
    )
  }
}
