import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}


import TransactionsList from '../components/TransactionsList.js';
import EntranceForm from '../components/EntranceForm';

const transactionsList = new TransactionsList('.transactions__list');
const entranceForm = new EntranceForm({
  input: '.entrance__input',
  button: '.entrance__button'
});

document.querySelector('.entrance__form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const account = this.querySelector('.entrance__input').value;
  entranceForm.disableInput();
  await transactionsList.fetchTransactions(account, 100);
  transactionsList.renderTransactions({
    template: '.transaction-template',
    heading: '.transaction__heading',
    hash: '.transaction__hashlink',
    time: '.transaction__time',
    button: '.transaction__more',
    source: '.transaction__source',
    sourceVisible: 'transaction__source_visible'
  }, () => entranceForm.enableInput());
});

// for testing purpose
document.addEventListener('DOMContentLoaded', async function () {
  const account = 'rybkaklaus.near';
  await transactionsList.fetchTransactions(account, 100);
  transactionsList.renderTransactions({
    template: '.transaction-template',
    heading: '.transaction__heading',
    hash: '.transaction__hashlink',
    time: '.transaction__time',
    button: '.transaction__more',
    source: '.transaction__source',
    sourceVisible: 'transaction__source_visible'
  }, () => {});
});