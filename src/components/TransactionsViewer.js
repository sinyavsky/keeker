import TransactionFactory from './TransactionFactory.js';

export default class TransactionsViewer {

  constructor(cfg) {
    this._account = cfg.account;
    this._limit = cfg.limit;
    this._transactions = {};
  }

  async fetchTransactions() {
    const response = await fetch('https://helper.mainnet.near.org/account/' + this._account + '/activity?limit=' + this._limit);
    const data = await response.json();
    
    this._transactions = data;
  }  

  devPrintTransactions() {
    console.log('init transactions:');
    console.log(this._transactions);
    
    const resTransactions = [];

    const account = this._account;

    this._transactions.forEach(function(item) {
      const factory = new TransactionFactory({trx: item, account: account });
      const trx = factory.create();
     
      document.querySelector('.transactions__list').append(trx.createHtmlElement({
        template: '.transaction-template',
        heading: '.transaction__heading',
        hash: '.transaction__hashlink',
        time: '.transaction__time'
      }));
      resTransactions.push(trx);
    });
    
  }

}