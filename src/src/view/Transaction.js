import { ACTION_KIND/*, ACTION_DIRECTION*/ } from '../utils/constants.js';
import { formatDateFromNanoseconds } from '../utils/format.js';
import { prettyPrintJson } from 'pretty-print-json';

export default class Transaction {

  constructor(data) {
    this._heading = data.heading;
    this._iconSrc = data.iconSrc;
    this._actionKind = data.actionKind;
    this._actionDirection = data.actionDirection;
    this._hash = data.hash;
    this._blockHash = data.blockHash;    
    this._blockTimestamp = data.blockTimestamp;
    this._source = data.source;
  }

  isFunctionCall() {
    return this._actionKind === ACTION_KIND.FUNCTION_CALL;
  }

  createHtmlElement = (sel) => {
    this._html = document.querySelector(sel.template).content.cloneNode(true);  
    //const transaction = this._html.querySelector(sel.transaction);
    switch(this._actionKind) {
      case ACTION_KIND.FUNCTION_CALL:
      break;
      case ACTION_KIND.TRANSFER:
        /*if(this._actionDirection === ACTION_DIRECTION.IN) {

        }
        else if(this._actionDirection === ACTION_DIRECTION.OUT) {

        }*/
      break;
      case ACTION_KIND.ADD_KEY:
      break;
      case ACTION_KIND.DELETE_KEY:
      break;
      case ACTION_KIND.DEPLOY_CONTRACT:
      break;
      case ACTION_KIND.STAKE:
      break;
      case ACTION_KIND.CREATE_ACCOUNT:
      break;
      case ACTION_KIND.DELETE_ACCOUNT:
      break;      
    }

    const heading = this._html.querySelector(sel.heading);
    const hash = this._html.querySelector(sel.hash);
    const time = this._html.querySelector(sel.time);
    const source = this._html.querySelector(sel.source);
    
    heading.insertAdjacentHTML('afterbegin', this._heading);

    hash.href += this._hash;
    hash.title = 'View at explorer.near.org';
    hash.textContent = this._hash;

    time.textContent = formatDateFromNanoseconds(this._blockTimestamp); // blockTimestamp in nanoseconds

    const button = this._html.querySelector(sel.button);
    button.addEventListener('click', () => {
      if(source.classList.contains(sel.sourceVisibleClass)) {
        button.textContent = 'Show source';
      }
      else {
        button.textContent = 'Hide source';
      }
      source.classList.toggle(sel.sourceVisibleClass);
    });

    source.insertAdjacentHTML('afterbegin', prettyPrintJson.toHtml(this._source));

    if(this._iconSrc) {
      this._html.querySelector(sel.icon).innerHTML = `<img src="${this._iconSrc}" alt="" class="${sel.iconPicClass}">`;
    }

    return this._html;
  };
}