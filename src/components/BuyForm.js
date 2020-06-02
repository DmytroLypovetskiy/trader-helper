import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
const API = "http://localhost:5000";
import setAuthToken from '../utils/setAuthToken';

class BuyForm extends Component {
  state = {
    symbol: '',
    qty: 0,
    date: '',
    price: 0
  }

  buyStock = async (e) => {
    e.preventDefault();

    const transaction = await axios.post(`${API}/api/transactions/buy`, { ...this.state });

    if (transaction) {
      this.setState({
        symbol: '',
        qty: 0,
        date: '',
        price: 0
      })
    }
  }

  setFieldToState = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { symbol, qty, date, price } = this.state;

    return (
      <form onSubmit={this.buyStock}>
        <div className="input-group my-3">
          <input type="text" className="form-control" name="symbol" placeholder="Symbol"
            value={symbol}
            onChange={this.setFieldToState}
            required
          />
          <input type="text" className="form-control" name="qty" placeholder="Qty"
            value={qty}
            onChange={this.setFieldToState}
            required />
          <input type="text" className="form-control" name="price" placeholder="Price"
            value={price}
            onChange={this.setFieldToState}
            required />
          <input type="date" className="form-control" name="date" placeholder="Date"
            value={date}
            onChange={this.setFieldToState}
            required />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit" id="button-stock-buy">Add</button>
          </div>
        </div>
      </form>
    )
  }
}

export default BuyForm;