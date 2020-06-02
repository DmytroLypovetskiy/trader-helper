import React, { Component } from 'react'
import axios from 'axios';
const API = "http://localhost:5000";
const finAPI = "https://finnhub.io/api/v1";
import { BuyForm } from './index';

export default class Dashboard extends Component {
  state = {
    stocks: [],
    watchlist: [],
    news: []
  }
  async componentDidMount() {
    const { data } = await axios.get(`${API}/api/profile`);
    const { stocks, watchlist } = data;

    /*
    const d = (await axios.get(`${finAPI}/quote?symbol=AAPL&token=br8k8g7rh5ral083hgd0`)).data;

    console.log(d);
    */

    fetch(`${finAPI}/quote?symbol=AAPL&token=br8k8g7rh5ral083hgd0`)
      .then(res => res.json())
      .then(res => console.log(res))



    /*
    fetch('https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2020-04-30&to=2020-05-01&token=br8k8g7rh5ral083hgd0')
      .then(res => res.json())
      .then(res => console.log(res))

    const news = (await axios.get('https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2020-04-30&to=2020-05-01&token=br8k8g7rh5ral083hgd0')).data;
    console.log(news);
    */

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
                    console.log(stock);
                    return <li key={stock._id} className="row mb-3">
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
                  })}
                </ul>
              }
            </div>


            <div className="card p-3">
              <h2 className="h5">Watchlist</h2>
            </div>


          </div>
          <div className="col-lg-3 col-md-6 d-flex">
            <div className="card p-3 flex-grow-1">
            </div>
          </div>
        </div>
      </>
    )
  }
}
