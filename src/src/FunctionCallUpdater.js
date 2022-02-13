import { CONTRACT_INTERFACE, FILTER_SECTION, FILTER_ELEMENT } from './utils/constants.js';
import iconFunctionCall from '../images/function-call.svg';
import TransactionParser from './parser/TransactionParser.js';
import parseContractInterface from './parser/parseContractInterface.js';
import contractApi from './api/contractApi.js';

import transferToAurora from './recognizer/transferToAurora.js';
import validatorNode from './recognizer/validatorNode.js';
import accountNear from './recognizer/accountNear.js';
import dexRefFinance from './recognizer/dexRefFinance.js';
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
    this._validatorsList = data.validatorsList;
    this._trxParser = new TransactionParser(data.trx);

    this._filter = data.filter;

    this._heading = '';
    this._iconSrc = '';
    this._iconAlt = '';
    this._filterData = [];
  }

  _addFilterData(data) {
    this._filterData.push(data);
  }

  _recognize(data) {
    if(data === false) {
      return false;
    }
    // 1 trx can have multiple filters
    if(Array.isArray(data.filter)) {
      data.filter.forEach((item) => {
        this._addFilterData(this._filter.addItem(item.section, item.element));
      });
    }
    else {
      this._addFilterData(this._filter.addItem(data.filter.section, data.filter.element));
    }
    

    // add heading and icon only if not set before
    if(!this._heading) {
      this._heading = data.heading;
    }

    if(!this._iconSrc) {
      this._iconSrc = data.iconSrc;
    }
    
    if(!this._iconSrc) {
      this._iconAlt = data.iconAlt;
    }   

    return true;
  }

  async _prepare() {
    
    // first, let's check transactions that can be assigned only to 1 filter

    if(this._recognize(transferToAurora(this._trxParser))) {
      return;
    }

    if(this._recognize(validatorNode(this._trxParser, this._validatorsList, this._currentAccount))) {
      return;
    }

    if(this._recognize(accountNear(this._trxParser))) {
      return;
    }

    if(this._recognize(dexRefFinance(this._trxParser))) { // todo: will not assign FT section to filter, solution needed
      return;
    }

    // so transaction can have multiple filter

    this._recognize(launchpadBocaChica(this._trxParser));

    const contractData = await contractApi.getContractData(this._trxParser.getFunctionCallReceiver());
    const contractInterface = parseContractInterface(contractData);
    
    if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
      const metadata = await contractApi.ft_metadata(this._trxParser.getFunctionCallReceiver());
      if(!this._recognize(accountWrap(this._trxParser, metadata, this._currentAccount))) { // we don't want duplicate wNEAR to Fungible token section
        this._recognize(fungibleToken(this._trxParser, metadata, this._currentAccount));
      }
      
    }
    else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
      const metadata = await contractApi.nft_metadata(this._trxParser.getFunctionCallReceiver());
      this._recognize(nonFungibleToken(this._trxParser, metadata));
    }

    // since recognizers may return not full set of info
    if(!this._heading) { 
      this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from contract ${this._trxParser.getFunctionCallReceiver()}`;
    }

    if(!this._iconSrc) {
      this._iconSrc = iconFunctionCall;
    }

    if(!this._iconAlt) {
      this._iconAlt = 'Function Call';
    }
    
    if(this._filterData.length === 0) {
      this._addFilterData(this._filter.addItem(FILTER_SECTION.OTHER, FILTER_ELEMENT.OTHER_FUNCTION_CALL));
    } 
  }

  async update() {
    await this._prepare();
    
    this._trxElement.setAttribute('data-filter', this._filterData.join(' '));
    this._headingElement.innerHTML = this._heading;
    this._iconElement.innerHTML = `<img src="${this._iconSrc}" alt="${this.__iconAlt}" class="transaction__icon-picture">`;
  }
}