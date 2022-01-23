import { CONTRACT_INTERFACE } from '../utils/constants.js';
import { formatNearAmount, formatTokenAmount } from "../utils/format.js";
import iconFunctionCall from '../images/function-call.svg';

export default class FunctionCallUpdater {  
  constructor(data) {
    this._headingElement = data.headingElement;
    this._iconElement = data.iconElement;
    this._currentAccount = data.currentAccount;
    this._trx = data.trx;
    this._parser = data.parser;
  }

  async generateHeading() {

    this._heading = `Call function ${this._trx.args.method_name} from contract ${this._trx.receiver_id}`; // default

    if(this._trx.receiver_id === 'wrap.near') {
      if(this._trx.args.method_name === 'ft_transfer_call') {
        if(this._trx.args.args_json.receiver_id === "aurora") { // aurora contract
          const nearAmount = formatNearAmount(this._trx.args.args_json.amount);
          this._heading = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${this._trx.args.args_json.msg}`;
        }
      }
    }
    else {   
      const contractData = await this._parser.getContractData(this._trx.receiver_id);
      const contractInterface = this._parser.getInterface(contractData);
      if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
        const metadata = await this._parser.ft_metadata(this._trx.receiver_id);
        this._heading = this._generateFtHeading(metadata);
      }
      else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
        const metadata = await this._parser.nft_metadata(this._trx.receiver_id);
        this._heading = this._generateNftHeading(metadata);
      }
      else {
        this._iconElement.innerHTML = `<img src="${iconFunctionCall}" alt="" class="transaction__icon-picture">`;
      }
    }
    this._headingElement.innerHTML = this._heading;  
  }

  _generateFtHeading(metadata) {
    if(this._trx.args.method_name === "ft_transfer_call") {
      if(metadata.symbol.length > 0) {
        this._iconElement.innerHTML = `<img src="${metadata.icon}" alt="${metadata.name}" class="transaction__icon-picture">`;
      }
      const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
      const tokenAmount = formatTokenAmount(this._trx.args.args_json.amount, metadata.decimals);
      if(this._trx.signer_id === this._currentAccount) {
        return `Send ${tokenAmount} ${tokenName} to ${this._trx.args.args_json.receiver_id}`;
      }
      return `Receive ${tokenAmount} ${tokenName} from ${this._trx.args.args_json.receiver_id}`;
    }
    return 'Interaction with Fungible token contract';
  }

  _generateNftHeading(metadata) {
    return `Interraction with NFT contract <img src="${metadata.icon}" alt=""> ${metadata.symbol} (${metadata.name})`;
  }

}