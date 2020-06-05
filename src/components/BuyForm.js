import React, { Component } from 'react';
import axios from 'axios';
const API = "http://localhost:5000";

class BuyForm extends Component {
  state = {
    stocks: [],
    symbol: '',
    qty: '',
    date: '',
    price: ''
  }
  /*
  componentDidMount() {
    const { stocks } = this.props;

    this.setState({ stocks });
  }

  componentDidUpdate(prev) {
    if (prev.stocks.length !== this.props.stocks.length) {
      const { stocks } = this.props;

      this.setState({ stocks });
    }
  }
  */
  buyStock = async (e) => {
    e.preventDefault();

    try {
      const transaction = await axios.post(`${API}/api/transactions/buy`, { ...this.state });
      const { updateStocks } = this.props;
      const { symbol, qty } = this.state;

      updateStocks(symbol, qty);

      if (transaction) {
        this.setState({
          symbol: '',
          qty: '',
          date: '',
          price: ''
        });
      }
    } catch (err) {
      console.error(err)
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