import React, { Component } from 'react';
import axios from 'axios';
const API = "http://localhost:5000";

class BuyForm extends Component {
  state = {
    symbol: '',
    qty: '',
    date: '',
    price: ''
  }
  buyStock = async (e) => {
    e.preventDefault();

    try {
      const { symbol, qty, date, price } = this.state;
      const transaction = await axios.post(`${API}/api/transactions/buy`, { symbol, qty: Number(qty), date, price: Number(price) });

      if (transaction) {
        const { addTransaction } = this.props;
        const transactionData = {
          symbol,
          transaction: { qty, price, transactionId: transaction.data._id }
        }

        this.setState({
          symbol: '',
          qty: '',
          date: '',
          price: ''
        });

        addTransaction(transactionData);
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
    //console.log(this.state);

    return (
      <form onSubmit={this.buyStock}>
        <div className="input-group my-3 shadow-sm">
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