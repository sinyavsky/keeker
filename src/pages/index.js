import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

import Api from '../components/Api.js';
import Parser from '../components/Parser.js';

import EntranceForm from '../components/EntranceForm.js';
import TransactionsList from '../components/TransactionsList.js';
import Transaction from '../components/Transaction.js';


const api = new Api();
const entranceForm = new EntranceForm({
  input: '.entrance__input',
  button: '.entrance__button'
});


const transactionsList = new TransactionsList('.transactions__list');

document.querySelector('.entrance__form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const account = this.querySelector('.entrance__input').value;
  entranceForm.disableInput();

  const transactions = await api.getAccountTransactions(account, 100);
  const parser = new Parser();  

  if(transactions.length > 0) {
    transactionsList.clear();
    transactions.forEach((item) => {      
      const trxData = parser.getTransactionData(item, account);      
      const trx = new Transaction(trxData);     
      transactionsList.renderTransaction(trx.createHtmlElement({
        template: '.transaction-template',
        heading: '.transaction__heading',
        hash: '.transaction__hashlink',
        time: '.transaction__time',
        button: '.transaction__more',
        source: '.transaction__source',
        sourceVisible: 'transaction__source_visible'
      }));
    });
  } else {
    transactionsList.renderEmptyResult();
  }

  entranceForm.enableInput();
});