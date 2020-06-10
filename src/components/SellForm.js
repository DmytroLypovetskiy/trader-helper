import React, { Component } from 'react';
import axios from 'axios';
const API = "http://localhost:5000";

class SellForm extends Component {
  state = {
    qty: '',
    price: '',
    date: Date.now()
  }
  sellStock = async (e) => {
    e.preventDefault();

    /*
    try {
      const { qty, price, date } = this.state;
      const { stock: { symbol, transactionId }, updateTransaction } = this.props;

      const transaction = await axios.post(`${API}/api/transactions/sell/${transactionId}`, { symbol, ...this.state });

      console.log(this.props.stock.qty, qty);

      if (qty !== 0 && price !== 0 && this.props.stock.qty >= qty) {
        console.log(this.props.stock);
        const transactionData = {
          symbol,
          transaction: { qty, price, transactionId }
        }

        this.setState({
          qty: '',
          price: '',
          date: Date.now()
        });

        updateTransaction(transactionData);
      }
    } catch (err) {
      console.error(err)
    }
    */
  }
  setFieldToState = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    const { qty, price } = this.state;

    return (
      <form onSubmit={this.sellStock}>
        <div className="input-group input-group-sm shadow-sm">
          <input type="text" className="form-control" name="qty" placeholder="Qty"
            value={qty}
            onChange={this.setFieldToState}
            required />
          <input type="text" className="form-control" name="price" placeholder="Price"
            value={price}
            onChange={this.setFieldToState}
            required />
          <div className="input-group-append">
            <button className="btn btn-danger" type="submit" id="button-stock-buy"><i className="fas fa-coins"></i></button>
          </div>
        </div>
      </form>
    )
  }
}

export default SellForm;