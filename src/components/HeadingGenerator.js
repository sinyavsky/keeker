import { utils } from "near-api-js";
import ContractParser from "./ContractParser.js";
import { CONTRACT_INTERFACE } from '../utils/constants.js';
import { formatTokenAmount } from "../utils/format.js";
import iconFunctionCall from '../images/function-call.svg';

export default class HeadingGenerator {
  constructor() {
    this._input = [];
  }

  push(element) {
    this._input.push(element);
  }

  _generateFtHeading(trx, account, metadata, iconElement) {
    if(trx.args.method_name === "ft_transfer_call") {
      if(metadata.symbol.length > 0) {
        iconElement.innerHTML = `<img src="${metadata.icon}" alt="${metadata.name}" class="transaction__icon-picture">`;
      }
      const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
      const tokenAmount = formatTokenAmount(trx.args.args_json.amount, metadata.decimals, 2);
      if(trx.signer_id === account) {
        return `Send ${tokenAmount} ${tokenName} to ${trx.args.args_json.receiver_id}`;
      }
      return `Receive ${tokenAmount} ${tokenName} from ${trx.args.args_json.receiver_id}`;
    }
    return 'Interaction with Fungible token contract';
  }

  _generateNftHeading(trx, metadata) {
    return `Interraction with NFT contract <img src="${metadata.icon}" alt=""> ${metadata.symbol} (${metadata.name})`;
  }

  async generateHeadings() {
    const parser = new ContractParser();
    for(let i = 0; i < this._input.length; i++) {      
      const item = this._input[i];
      let res = `Call function ${item.trx.args.method_name} from contract ${item.trx.receiver_id}`; // default
      if(item.trx.receiver_id === 'wrap.near') {
        if(item.trx.args.method_name === 'ft_transfer_call') {
          if(item.trx.args.args_json.receiver_id === "aurora") { // aurora contract
            const nearAmount = utils.format.formatNearAmount(item.trx.args.args_json.amount, 2);
            res = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${item.trx.args.args_json.msg}`;
          }
        }
      }

      else {   
        const contractData = await parser.getContractData(item.trx.receiver_id);
        const contractInterface = parser.getInterface(contractData);
          if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
            const metadata = await parser.ft_metadata(item.trx.receiver_id);
            res = this._generateFtHeading(item.trx, item.account, metadata, item.iconElement);
          }
          else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
            const metadata = await parser.nft_metadata(item.trx.receiver_id);
            res = this._generateNftHeading(item.trx, metadata);
          }
          else {
            item.iconElement.innerHTML = `<img src="${iconFunctionCall}" alt="" class="transaction__icon-picture">`;
          }
      }
      item.headingElement.innerHTML = res;
    }    
  }
}