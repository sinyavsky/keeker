import TransactionFactory from '../components/TransactionFactory.js';

export default class TransactionsList {
  constructor(selector) {
    this._html = document.querySelector(selector);
  }

  _showLoader() {
    this._html.textContent = 'Loading...';
  }

  _hideLoader() {
    this._html.textContent = '';
  }

  _renderEmptyResult() {
    this._html.textContent = 'No transactions found for this account :(';
  }

  async fetchTransactions(account, limit) {
    this._account = account;
    this._showLoader();
    const response = await fetch('https://helper.mainnet.near.org/account/' + this._account + '/activity?limit=' + limit);
    this._transactions = await response.json();
  }

  renderTransactions = (transactionSelectors, onRenderComplete) => {
    this._hideLoader();
    if(this._transactions.length > 0) {
      this._transactions.forEach((item) => {      
        const factory = new TransactionFactory({trx: item, account: this._account });
        const trx = factory.create();
       
        this._html.append(trx.createHtmlElement(transactionSelectors));
      });
    }
    else {
      this._renderEmptyResult();
    }
    
    onRenderComplete();
  }
}