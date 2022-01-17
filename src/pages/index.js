/*eslint no-undef: 0*/

//import { transactions } from 'near-api-js';
import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

import TransactionViewer from '../components/TransactionsViewer.js';

async function renderResult(account) {
  const viewer = new TransactionViewer({ account, limit: 100 });

  await viewer.fetchTransactions();
  viewer.devPrintTransactions();
}

document.addEventListener('DOMContentLoaded', function () {

  renderResult("rybkaklaus.near");

});

/*
document.querySelector('.entrance__form').addEventListener('submit', function (e) {
  e.preventDefault();

  const account = this.querySelector('.entrance__input').value;
  renderResult(account);

});*/