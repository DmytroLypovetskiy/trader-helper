import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from '../utils/setAuthToken';
import Moment from 'react-moment';

class StockInfo extends Component {
  state = {
    buy: null,
    sell: []
  }

  async componentDidMount() {
    const { stock } = this.props;
    //const purchases = (await axios.get(`${API}/api/transactions/buy/${symbol}`)).data;
    const transaction = (await axios.get(`${API}/api/transactions/${stock.buy}`)).data;

    //this.setState({ symbol, qty, purchases });

    //console.log(stock);
    console.log(transaction);
  }


  render() {
    const { buy, sell } = this.state;



    return (

      <li className="row mb-3">
        {/*
        <div className="col-lg-5">
          <p className="d-flex justify-content-between"><strong className="h4">{symbol}</strong> <span> {qty} <small>stock(s)</small></span></p>
          <p className="small text-muted">purchases:</p>

          {purchases &&
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
                {purchases.map(purchase => {

                  return (
                    <tr key={purchase._id}>
                      <td>{purchase.qty}</td>
                      <td><small className="text-muted">USD</small> {purchase.price}</td>
                      <td><Moment format='YYYY/MM/DD'>{purchase.date}</Moment></td>
                      <td><span className="btn badge badge-success">136%</span></td>
                    </tr>)
                })}

              </tbody>
            </table>
          }


          <p><span className="btn badge badge-light">102%</span></p>
          <p><span className="btn badge badge-success">136%</span></p>
          <p><span className="btn badge badge-danger">71%</span></p>





        </div>
        <div className="col-lg-7">
          chart
        </div>
        */}
      </li>
    )
  }
}

export default StockInfo;