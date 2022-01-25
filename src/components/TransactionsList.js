export default class TransactionsList {
  constructor(selector) {
    this._html = document.querySelector(selector);
  }

  clear() {
    this._html.textContent = '';
  }

  renderEmptyResult() {
    this._html.textContent = 'No transactions found for this account :(';
  }

  renderTransaction = (transaction) => {
    this._html.append(transaction);
  };
}