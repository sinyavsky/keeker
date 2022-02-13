import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

import getSourceTransactions from '../src/api/getSourceTransactions.js';
import getValidatorsList from '../src/api/getValidatorsList.js';

import getTransactionBaseData from '../src/getTransactionBaseData.js';
import FunctionCallUpdater from '../src/FunctionCallUpdater.js';

import EntranceForm from '../src/view/EntranceForm.js';
import ProgressBar from '../src/view/ProgressBar.js';
import Filter from '../src/view/Filter.js';
import TransactionsList from '../src/view/TransactionsList.js';
import Transaction from '../src/view/Transaction.js';


const entranceForm = new EntranceForm({
  form: '.entrance__form',
  account: '.entrance__input_type_account',
  limit: '.entrance__input_type_limit',
  button: '.entrance__button'
});

const progressBar = new ProgressBar({
  progressBar: '.progress-bar',
  loader: '.progress-bar__loader',
  text: '.progress-bar__text',
  current: '.progress-bar__current',
  total: '.progress-bar__total',  
  progressBarVisible: 'progress-bar_visible',
  loaderHidden: 'progress-bar__loader_hidden',
});

const filter = new Filter({
  selFilter: '.filter',
  selFilterList: '.filter__list',
  selFilterItemTemplate: '.filter-item-template',
  selFilterSectionItemTemplate: '.filter-section-item-template',
  selFilterSectionHeading: '.filter__section-heading',
  selFilterSectionList: '.filter__section-list',
  selFilterLabel: '.filter__label',
  selFilterCheckbox: '.filter__checkbox',
  selTransaction: '.transaction',
  selFilterShowAll: '.filter__button-select',
  selFilterHideAll: '.filter__button-deselect',
  classFilterVisible: 'filter_visible',
  classTransactionHidden: 'transaction_hidden',
  attrFilter: 'data-filter',
});


const transactionsList = new TransactionsList('.transactions__list');
const validatorsList = await getValidatorsList();
entranceForm.addSubmitListener(async function (e) {
  e.preventDefault();
  const account = entranceForm.getAccountName();
  entranceForm.disableInput();

  const transactions = await getSourceTransactions(account, entranceForm.getLimit());
  const functionCallUpdaterQueue = [];

  if(transactions.length > 0) {
    transactionsList.clear();
    progressBar.reset(transactions.length);
    filter.clear();
    
    transactions.forEach((item) => {
      const trxBaseData = getTransactionBaseData(item, account, filter);
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
        // attributes
        attrFilter: 'data-filter',
      });
      
      transactionsList.renderTransaction(trxElement);
      if(trx.isFunctionCall()) {
        trxElement = document.querySelector('.transactions__list .transaction:last-child'); // weird, I should refactor it
        functionCallUpdaterQueue.push({
          trxElement,
          headingElement: trxElement.querySelector('.transaction__heading'),
          iconElement: trxElement.querySelector('.transaction__icon'),
          trx: item,
          filter,
        });
      }
      else {
        progressBar.increment();
      }
    });

    if(functionCallUpdaterQueue.length > 0) {
      for(let i = 0; i < functionCallUpdaterQueue.length; i++) {
        progressBar.increment();
        const functionCallUpdater = new FunctionCallUpdater({
          ...functionCallUpdaterQueue[i],
          currentAccount: account,
          validatorsList,
        });
        await functionCallUpdater.update();
      }
    }

    progressBar.finish();
    filter.render();
    
  } else {
    transactionsList.renderEmptyResult();
  }

  entranceForm.enableInput();
});