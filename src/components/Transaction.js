import { utils } from "near-api-js";
import { TRANSACTION_TYPE, TRANSACTION_SUB_TYPE } from '../utils/constants.js';

export default class Transaction {

  constructor(data) {
    // trx data
    this._heading = data.heading;
    this._type = data.type;
    this._subType = data.subType;
    this._hash = data.hash;
    this._blockHash = data.blockHash;    
    this._amount = data.amount;
    this._blockTimestamp = data.blockTimestamp;
    this._partner = data.partner;
    this._partnerAurora = data.partnerAurora;

    // content
    this._heading = '';

    this._prepareContent();
  }

  _prepareContent() {
    
    const amount = utils.format.formatNearAmount(this._amount, 2);
    switch(this._type) {
      case TRANSACTION_TYPE.FUNCTION_CALL:
        if(this._subType === TRANSACTION_SUB_TYPE.TRANSFER_TO_AURORA) {
          this._heading = `Send ${amount} NEAR to Aurora address ${this._partnerAurora}`;
        }
        else {
          this._heading = 'Call function from contract';
        }
      break;
      case TRANSACTION_TYPE.TRANSFER:
        
        if(this._subType === TRANSACTION_SUB_TYPE.SEND) {
          this._heading = `Send ${amount} NEAR to ${this._partner}`;
        }
        else if(this._subType === TRANSACTION_SUB_TYPE.RECEIVE) {
          this._heading = `Receive ${amount} NEAR from ${this._partner}`;
        }
        else { // хз что
          this._heading = 'Unknown action'; // handle this
        }        
      break;
      case TRANSACTION_TYPE.ADD_KEY:
        this._heading = 'Add key';
      break;
      case TRANSACTION_TYPE.DELETE_KEY:
        this._heading = 'Delete key';
      break;
      case TRANSACTION_TYPE.DEPLOY_CONTRACT:
        this._heading = 'Deploy contract';
      break;
      case TRANSACTION_TYPE.STAKE:
        this._heading = 'Stake';
      break;
      case TRANSACTION_TYPE.CREATE_ACCOUNT:
        this._heading = 'Create account';
      break;
      case TRANSACTION_TYPE.DELETE_ACCOUNT:
        this._heading = 'Delete account';
      break;
      default:
        this._heading = 'Unknown action'; // handle this
      break;      
    }
  }

  createHtmlElement = (sel) => {

    this._html = document.querySelector(sel.template).content.cloneNode(true);  

    const heading = this._html.querySelector(sel.heading);
    const hash = this._html.querySelector(sel.hash);
    const time = this._html.querySelector(sel.time);

    heading.insertAdjacentHTML('afterbegin', this._heading);

    hash.title = 'View at explorer.near.org';
    hash.textContent = this._hash;

    time.textContent = new Date(this._blockTimestamp / 1000000); // blockTimestamp in nanoseconds

    return this._html;
  }
}