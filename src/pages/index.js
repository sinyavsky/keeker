import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

import getSourceTransactions from '../src/api/getSourceTransactions.js';
import getTransactionBaseData from '../src/getTransactionBaseData.js';
import ContractParser from '../src/ContractParser.js';
import FunctionCallUpdater from '../src/FunctionCallUpdater.js';

import EntranceForm from '../src/view/EntranceForm.js';
import TransactionsList from '../src/view/TransactionsList.js';
import Transaction from '../src/view/Transaction.js';


const entranceForm = new EntranceForm({
  input: '.entrance__input',
  button: '.entrance__button'
});


const transactionsList = new TransactionsList('.transactions__list');
const contractParser = new ContractParser(); // should be global because of caching inside
await contractParser.prepareValidatorsList();
document.querySelector('.entrance__form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const account = this.querySelector('.entrance__input').value;
  entranceForm.disableInput();

  const transactions = await getSourceTransactions(account, 100);
  const functionCallUpdaterQueue = [];

  if(transactions.length > 0) {
    transactionsList.clear();
    
    transactions.forEach((item) => {      
      const trxBaseData = getTransactionBaseData(item, account);
      const trx = new Transaction(trxBaseData);
      let trxElement = trx.createHtmlElement({
        // selectors
        template: '.transaction-template',
        transaction: '.transaction',
        icon: '.transaction__icon',
        heading: '.transaction__heading',
        hash: '.transaction__hashlink',
        time: '.transaction__time',
        button: '.transaction__more',
        source: '.transaction__source',
        // classes
        iconPicClass: 'transaction__icon-picture',
        sourceVisibleClass: 'transaction__source_visible',
      });
      
      transactionsList.renderTransaction(trxElement);
      if(trx.isFunctionCall()) {        
        trxElement = document.querySelector('.transactions__list .transaction:last-child'); // weird, I should refactor it
        functionCallUpdaterQueue.push({
          headingElement: trxElement.querySelector('.transaction__heading'),
          iconElement: trxElement.querySelector('.transaction__icon'),
          trx: item,
        });
      }
    });

    if(functionCallUpdaterQueue.length > 0) {
      for(let i = 0; i < functionCallUpdaterQueue.length; i++) {
        const functionCallUpdater = new FunctionCallUpdater({
          ...functionCallUpdaterQueue[i],
          currentAccount: account,
          contractParser,
        });
        await functionCallUpdater.generateHeading();
      }
    }
    
  } else {
    transactionsList.renderEmptyResult();
  }

  entranceForm.enableInput();
});