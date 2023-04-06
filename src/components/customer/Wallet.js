import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddMoneyToWallet from './AddMoneyToWallet';
import { currencyFormat, dateFormat } from '../../utilities';
import { fetchWalletInfo, saveWalletInfoToMemory } from '../../actions/customer';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: props.wallet,
      processing: false
    };

    this.fetchWallet = this.fetchWallet.bind(this);
  }

  componentWillMount() {
    if (typeof this.state.wallet.transactions === 'undefined') {
      this.setState({
        processing: true
      });
    }

    this.fetchWallet(false);
  }

  fetchWallet(processing) {
    if (processing === true) {
      this.setState({
        processing: true
      });
    }
    fetchWalletInfo().then(response => {
      this.setState({
        wallet: response.data[0],
        processing: false
      });
      this.props.saveWalletInfoToMemory(response.data[0]);
    });
  }

  printStatus(status) {
    let result = '';
    switch (status) {
      case '0':
        result = 'Pending';
        break;

      case '1':
        result = 'Applied';
        break;

      case '2':
        result = 'Cancelled';
        break;
    }

    return result;
  }

  render() {
    const { wallet, processing } = this.state;

    return (
      <div className="content-my-wallet">
        <div className="head-tabs">
          <h2>My Wallet</h2>
        </div>
        <div className="wallet-wrapper">
          <div className="wallet-money-left">
            <span className="icon-wallet"></span>
            <div className="balance-counter">
              <label>{currencyFormat(parseFloat(wallet.wallet_amount).toFixed(2), 'INR')}</label>
              <p>Your Wallet Balance</p>
            </div>
          </div>
          <AddMoneyToWallet callback={this.fetchWallet} />
        </div>
        <div className="waller-container">
          <div className="wallet-statement">
            <div className="head-tabs">
              <h3>View statement</h3>
            </div>

            <div className="statement-table">
              <table>
                <thead>
                  <tr>
                    <th width="15%">Amount</th>
                    <th width="10%">Action</th>
                    <th width="10%">Status</th>
                    <th width="25%">Transaction At</th>
                    <th width="40%">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    processing === false
                      ?
                      typeof wallet.transactions !== 'undefined' && wallet.transactions.length > 0
                        ?
                        wallet.transactions.map(item => {
                          return <tr key={item.entity_id}>
                            <td>{currencyFormat(parseFloat(item.amount).toFixed(2), 'INR')}</td>
                            <td>{item.action}</td>
                            <td className={item.status == '0' ? 'tranaction-pending' : ''}>{this.printStatus(item.status)}</td>
                            <td>{dateFormat(item.transaction_at, 'DD MMM, YYYY hh:mm a')}</td>
                            <td>{item.transaction_note}</td>
                          </tr>
                        })
                        :
                        <tr>
                          <td colSpan="5" align="center">
                            No transaction found.
                          </td>
                        </tr>
                      :
                      <tr>
                        <td colSpan="5" align="center">
                          <div style={{ position: 'relative' }}><div className="loading-block"></div></div>
                        </td>
                      </tr>
                  }

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    wallet: { ...state.Customer.wallet }
  }
}

export default connect(mapStatesToProps, { saveWalletInfoToMemory })(Wallet);
