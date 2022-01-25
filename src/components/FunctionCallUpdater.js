import { CONTRACT_INTERFACE } from '../utils/constants.js';
import { formatNearAmount, formatTokenAmount } from "../utils/format.js";
import iconFunctionCall from '../images/function-call.svg';
import TransactionParser from './TransactionParser.js';

export default class FunctionCallUpdater {  
  constructor(data) {
    this._headingElement = data.headingElement;
    this._iconElement = data.iconElement;
    this._currentAccount = data.currentAccount;
    this._contractParser = data.contractParser;
    this._trxParser = new TransactionParser(data.trx);
  }

  async generateHeading() {

    this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from contract ${this._trxParser.getFunctionCallReceiver()}`; // default

    if(this._trxParser.getFunctionCallReceiver() === 'wrap.near') {
      if(this._trxParser.getFunctionCallMethod() === 'ft_transfer_call') {
        if(this._trxParser.getFtTransferReceiver() === "aurora") { // aurora contract
          const nearAmount = formatNearAmount(this._trxParser.getFtTransferAmount());
          this._heading = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${this._trxParser.getFtTransferCallMessage()}`;
        }
      }
    }
    else {   
      const contractData = await this._contractParser.getContractData(this._trxParser.getFunctionCallReceiver());
      const contractInterface = this._contractParser.getInterface(contractData);
      if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
        const metadata = await this._contractParser.ft_metadata(this._trxParser.getFunctionCallReceiver());
        this._heading = this._generateFtHeading(metadata);
      }
      else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
        const metadata = await this._contractParser.nft_metadata(this._trxParser.getFunctionCallReceiver());
        this._heading = this._generateNftHeading(metadata);
      }
      else {
        this._iconElement.innerHTML = `<img src="${iconFunctionCall}" alt="" class="transaction__icon-picture">`;
      }
    }
    this._headingElement.innerHTML = this._heading;  
  }

  _generateFtHeading(metadata) {
    if(this._trxParser.getFunctionCallMethod() === "ft_transfer_call") {
      if(metadata.symbol.length > 0) {
        this._iconElement.innerHTML = `<img src="${metadata.icon}" alt="${metadata.name}" class="transaction__icon-picture">`;
      }
      const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
      const tokenAmount = formatTokenAmount(this._trxParser.getFtTransferAmount(), metadata.decimals);
      if(this._trxParser.getSignerId() === this._currentAccount) {
        return `Send ${tokenAmount} ${tokenName} to ${this._trxParser.getFtTransferReceiver()}`;
      }
      return `Receive ${tokenAmount} ${tokenName} from ${this._trxParser.getFtTransferReceiver()}`;
    }
    return 'Interaction with Fungible token contract';
  }

  _generateNftHeading(metadata) {
    return `Interraction with NFT contract <img src="${metadata.icon}" alt=""> ${metadata.symbol} (${metadata.name})`;
  }

}