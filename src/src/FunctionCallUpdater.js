import { CONTRACT_INTERFACE, FILTER_SECTION, FILTER_ELEMENT } from './utils/constants.js';
import iconFunctionCall from '../images/function-call.svg';
import TransactionParser from './parser/TransactionParser.js';
import parseContractInterface from './parser/parseContractInterface.js';

import transferToAurora from './recognizer/transferToAurora.js';
import validatorNode from './recognizer/validatorNode.js';
import accountNear from './recognizer/accountNear.js';
import launchpadBocaChica from './recognizer/launchpadBocaChica.js';
import accountWrap from './recognizer/accountWrap.js';
import fungibleToken from './recognizer/fungibleToken.js';
import nonFungibleToken from './recognizer/nonFungibleToken.js';

export default class FunctionCallUpdater {
  constructor(data) {
    this._trxElement = data.trxElement;
    this._headingElement = data.headingElement;
    this._iconElement = data.iconElement;
    this._currentAccount = data.currentAccount;
    this._contractApi = data.contractApi;
    this._validatorsList = data.validatorsList;
    this._trxParser = new TransactionParser(data.trx);

    this._filter = data.filter;

    this._heading = '';
    this._iconSrc = '';
    this._iconAlt = '';
    this._filterData = '';
  }

  _recognized(data) {
    if(data === false) {
      return false;
    }
    this._filterData = this._filter.addItem(data.filterSection, data.filterElement),
    this._heading = data.heading;
    this._iconSrc = data.iconSrc;
    this._iconAlt = data.iconAlt;
    return true;
  }

  async _prepare() {
    
    if(this._recognized(transferToAurora(this._trxParser))) {
      return;
    }

    if(this._recognized(validatorNode(this._trxParser, this._validatorsList))) {
      return;
    }

    if(this._recognized(accountNear(this._trxParser))) {
      return;
    }

    if(this._recognized(launchpadBocaChica(this._trxParser))) {
      return;
    }

    const contractData = await this._contractApi.getContractData(this._trxParser.getFunctionCallReceiver());
    const contractInterface = parseContractInterface(contractData);
    
    if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
      const metadata = await this._contractApi.ft_metadata(this._trxParser.getFunctionCallReceiver());
      if(this._recognized(accountWrap(this._trxParser, metadata, this._currentAccount))) {
        return;
      }
      if(this._recognized(fungibleToken(this._trxParser, metadata, this._currentAccount))) {
        return;
      }
    }
    else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
      const metadata = await this._contractApi.nft_metadata(this._trxParser.getFunctionCallReceiver());
      if(this._recognized(nonFungibleToken(this._trxParser, metadata))) {
        return;
      }
    }

    // default function call
    this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from contract ${this._trxParser.getFunctionCallReceiver()}`;
    this._iconSrc = iconFunctionCall;
    this._iconAlt = 'Function Call';
    this._filterData = this._filter.addItem(FILTER_SECTION.OTHER, FILTER_ELEMENT.OTHER_FUNCTION_CALL);
  }

  async update() {
    await this._prepare();
    
    this._trxElement.setAttribute('data-filter', this._filterData);
    this._headingElement.innerHTML = this._heading;
    this._iconElement.innerHTML = `<img src="${this._iconSrc}" alt="${this.__iconAlt}" class="transaction__icon-picture">`;
  }
}