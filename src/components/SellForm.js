import React, { Component } from 'react';
import axios from 'axios';
const API = "http://localhost:5000";

class SellForm extends Component {
  state = {
    qty: this.props.stock.qty,
    date: '',
    price: ''
  }
  sellStock = async (e) => {
    e.preventDefault();

    try {
      const { qty, price } = this.state;
      const { stock: { symbol, transaction } } = this.props;
      /* TODO: Fix hardcoded date */
      const sellTransaction = (await axios.post(`${API}/api/transactions/sell/${transaction}`, { symbol, qty: Number(qty), date: Date.now(), price: Number(price) })).data;

      if (sellTransaction) {
        const { updateTransaction } = this.props;

        updateTransaction({
          transaction,
          qty,
        });

        this.setState({
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
    const { price, qty } = this.state;

    return (
      <form onSubmit={this.sellStock}>
        <div className="input-group input-group-sm shadow-sm">
          <input type="text" className="form-control" name="qty" placeholder="Qty"
            value={qty}
            onChange={this.setFieldToState}
            pattern="\d{1,5}"
            title="Only digits"
            required />
          <input type="text" className="form-control" name="price" placeholder="Price"
            value={price}
            onChange={this.setFieldToState}
            pattern="[0-9]+(\\.[0-9][0-9]?)?"
            title="Not a price"
            required />
          <div className="input-group-append">
            <button className="btn btn-danger" type="submit" id="button-stock-buy"
              disabled={(!qty || isNaN(qty) || qty <= 0 || qty > this.props.stock.qty || !price || isNaN(price) || price <= 0) ? "disabled" : ""}
            ><i className="fas fa-coins"></i></button>
          </div>
        </div>
      </form>
    )
  }
}

export default SellForm;