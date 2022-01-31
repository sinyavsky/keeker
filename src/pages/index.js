import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

import getSourceTransactions from '../components/getSourceTransactions.js';
import getTransactionBaseData from '../components/getTransactionBaseData.js';
import ContractParser from "../components/ContractParser.js";
import FunctionCallUpdater from '../components/FunctionCallUpdater.js';

import EntranceForm from '../components/EntranceForm.js';
import TransactionsList from '../components/TransactionsList.js';
import Transaction from '../components/Transaction.js';



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
        trxTypeFunctionClass: 'transaction_type_function',
        trxTypeReceiveClass: 'transaction_type_receive',
        trxTypeSendClass: 'transaction_type_send',
        trxTypeAddKeyClass: 'transaction_type_add-key',
        trxTypeDeleteKeyClass: 'transaction_type_delete-key',
        trxTypeDeployClass: 'transaction_type_deploy',
        trxTypeStakeClass: 'transaction_type_stake',
        trxTypeCreateAccountClass: 'transaction_type_create-account',
        trxTypeDeleteAccountClass: 'transaction_type_delete-account',
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