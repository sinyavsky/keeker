import { CONTRACT_INTERFACE } from '../utils/constants.js';
import { formatNearAmount, formatTokenAmount } from "../utils/format.js";
import iconFunctionCall from '../images/function-call.svg';
import iconAurora from '../images/aurora.png';
import iconBocaChica from '../images/boca-chica.png';
import TransactionParser from './TransactionParser.js';

export default class FunctionCallUpdater {  
  constructor(data) {
    this._headingElement = data.headingElement;
    this._iconElement = data.iconElement;
    this._currentAccount = data.currentAccount;
    this._contractParser = data.contractParser;
    this._trxParser = new TransactionParser(data.trx);

    this._heading = '';
    this._icon = '';
  }

  _prepareIfAurora() {
    if(this._trxParser.getFunctionCallReceiver() === 'wrap.near'
    && this._trxParser.getFunctionCallMethod() === 'ft_transfer_call'
    && this._trxParser.getFtTransferReceiver() === "aurora") {
      const nearAmount = formatNearAmount(this._trxParser.getFtTransferAmount());
      this._heading = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${this._trxParser.getFtTransferCallMessage()}`;
      this._icon = `<img src="${iconAurora}" alt="Aurora" class="transaction__icon-picture">`;
      return true;
    }
    return false;
  }

  _prepareIfKnownContract() {
    if(this._trxParser.getFunctionCallReceiver() === 'launchpad.bocachica_mars.near'){
      if(this._trxParser.getFunctionCallMethod() === 'claim_refund') {
        this._heading = `Claim refund from Boca Chica launchpad sale #${this._trxParser.getBocaChicaSaleId()}`; // todo: sale name and description
        this._icon = `<img src="${iconBocaChica}" alt="Boca Chica" class="transaction__icon-picture">`;
        return true;
      }
    }
    return false;
  }

  _prepareFtHeading(metadata) {
    if(metadata.icon && metadata.icon.length > 0) {
      this._icon = `<img src="${metadata.icon}" alt="${metadata.name}" class="transaction__icon-picture">`;
    }

    const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
    if(this._trxParser.getFunctionCallMethod() === "ft_transfer_call" || this._trxParser.getFunctionCallMethod() === "ft_transfer") {      
      const tokenAmount = formatTokenAmount(this._trxParser.getFtTransferAmount(), metadata.decimals);
      if(this._trxParser.getSignerId() === this._currentAccount) {
        this._heading = `Send ${tokenAmount} ${tokenName} to ${this._trxParser.getFtTransferReceiver()}`;
        return;
      }
      this._heading = `Receive ${tokenAmount} ${tokenName} from ${this._trxParser.getFtTransferReceiver()}`;
      return;
    }
    else if(this._trxParser.getFunctionCallMethod() === "storage_deposit") {
      const tokenAmount = formatNearAmount(this._trxParser.getStorageDepositAmount());
      this._heading = `Deposit ${tokenAmount} NEAR into storage of ${tokenName} contract`;
      if(this._trxParser.getStorageDepositReceiver() != this._currentAccount) {
        this._heading += ` for account ${this._trxParser.getStorageDepositReceiver()}`;
      }
      return;
    }

    else if(this._trxParser.getFunctionCallMethod() === "storage_widthdraw") {// widthraw near from contract storage

    }


    this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from Fungible token contract ${this._trxParser.getFunctionCallReceiver()}`;
  }

  _prepareNftHeading(metadata) {
    if(metadata.icon && metadata.icon.length > 0) {
      this._icon = `<img src="${metadata.icon}" alt="${metadata.name}" class="transaction__icon-picture">`;
    }

    this._heading = `Interraction with NFT contract ${metadata.symbol} (${metadata.name})`;
  }

  async _prepareHeading() {
    if(this._prepareIfAurora()) {
      return;
    }

    if(this._prepareIfKnownContract()) {
      return;
    }

    // todo: special method for wrap.near
    
    const contractData = await this._contractParser.getContractData(this._trxParser.getFunctionCallReceiver());
    const contractInterface = this._contractParser.getInterface(contractData);
    
    if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
      const metadata = await this._contractParser.ft_metadata(this._trxParser.getFunctionCallReceiver());
      this._prepareFtHeading(metadata);
    }
    else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
      const metadata = await this._contractParser.nft_metadata(this._trxParser.getFunctionCallReceiver());
      this._prepareNftHeading(metadata);
    }   
  }

  async generateHeading() {

    await this._prepareHeading();

    if(this._heading.length < 1) {
      this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from contract ${this._trxParser.getFunctionCallReceiver()}`;
    }

    if(this._icon.length < 1) {
      this._icon = `<img src="${iconFunctionCall}" alt="Function call" class="transaction__icon-picture">`;
    }

    this._headingElement.innerHTML = this._heading;
    this._iconElement.innerHTML = this._icon;
  }
}