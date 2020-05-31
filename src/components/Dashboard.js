import React, { Component } from 'react'
import axios from 'axios';
const API = "http://localhost:5000";

export default class Dashboard extends Component {
  state = {
    stocks: [],
    watchlist: []
  }
  async componentDidMount() {
    const { data } = await axios.get(`${API}/api/profile`);
    const { stocks, watchlist } = data;

    this.setState({ stocks, watchlist })
  }
  render() {
    const { stocks, watchlist } = this.state;

    return (
      <>
        <h1>Dashboard</h1>
        <div className="row pt-3">
          <div className="col-lg-8 col-md-6">
            <div className="card p-3">
              <h2>My Stocks</h2>
              {stocks &&
                <ul className="list-unstyled pt-3">
                  {stocks.map(stock => {
                    console.log(stock);
                    return <li key={stock._id} className="row">
                      <div className="col-lg-3">
                        <p><strong>{stock.symbol}</strong></p>
                        <p className="text-muted">{stock.title}</p>
                        <p><small>$</small><strong className="h4">{stock.boughtFor}</strong></p>
                        <p><span className="btn badge badge-light">102%</span></p>
                        <p><span className="btn badge badge-success">136%</span></p>
                        <p><span className="btn badge badge-danger">71%</span></p>
                      </div>
                      <div className="col-lg-9">
                        rewv
                      </div>
                    </li>
                  })}
                </ul>
              }

              <h2>Watchlist</h2>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card p-3">
            </div>
          </div>
        </div>
      </>
    )
  }
}
