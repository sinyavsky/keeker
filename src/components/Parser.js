import { utils } from "near-api-js";
import { ACTION_KIND, ACTION_DIRECTION, CONTRACT_INTERFACE } from '../utils/constants.js';

export default class Parser {
  
  _parseFunctionCall(trx) {
    let res = `Call function ${trx.args.method_name} from contract ${trx.receiver_id}`; // default
    if(trx.receiver_id === 'wrap.near') {
      if(trx.args.method_name === 'ft_transfer_call') {
        if(trx.args.args_json.receiver_id === "aurora") { // aurora contract
          const nearAmount = utils.format.formatNearAmount(trx.args.args_json.amount, 2);
          res = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${trx.args.args_json.msg}`;
        }
      } 
    }
    return res;
  }

  getTransactionData(trx, currentAccount) {
    const res = {
      actionKind: trx.action_kind,
      hash: trx.hash,
      blockHash: trx.block_hash,
      blockTimestamp: trx.block_timestamp,
      source: trx
    };

    switch(trx.action_kind) {
      case ACTION_KIND.FUNCTION_CALL:
        res.heading = this._parseFunctionCall(trx);      
      break;
      case ACTION_KIND.TRANSFER:
        if(trx.signer_id === currentAccount) {
          const nearAmount = utils.format.formatNearAmount(trx.args.deposit, 2);
          res.heading = `Send ${nearAmount} NEAR to ${trx.receiver_id}`;
          res.actionDirection = ACTION_DIRECTION.OUT;
        }
        else {// trx.receiver_id === currentAccount
          const nearAmount = utils.format.formatNearAmount(trx.args.deposit, 2);
          res.heading = `Receive ${nearAmount} NEAR from ${trx.signer_id}`;
          res.actionDirection = ACTION_DIRECTION.IN;
        }
      break;
      case ACTION_KIND.ADD_KEY:
        res.heading = `Add key ${trx.args.public_key} with access ${trx.args.access_key.permission.permission_kind}`;

        if(trx.args.access_key.permission.permission_details && trx.args.access_key.permission.permission_details.receiver_id) {
          res.heading += ` for ${trx.args.access_key.permission.permission_details.receiver_id}`;
        }        
      break;
      case ACTION_KIND.DELETE_KEY:
        res.heading = `Delete key ${trx.args.public_key}`;
      break;
      case ACTION_KIND.DEPLOY_CONTRACT:
        res.heading = 'Deploy contract';
      break;
      case ACTION_KIND.STAKE:
        res.heading = 'Stake';
      break;
      case ACTION_KIND.CREATE_ACCOUNT:
        res.heading = `Create account ${trx.receiver_id}`;
      break;
      case ACTION_KIND.DELETE_ACCOUNT:
        res.heading = `Delete account ${trx.receiver_id}`;
        if(trx.args.beneficiary_id) {
          res.heading += ` and transfer remaining funds to beneficiary account: ${trx.args.beneficiary_id}`;
        }
      break;
      default:
        res.heading = 'Unknown action';
      break;      
    }
    return res;
  }

  getContractInterface(data) {
    try {
      if(['nep171', 'nep177', 'nep178'].some(r=> data.probableInterfaces.indexOf(r) >= 0)) {
        return CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN;
      }
  
      else if(['nep141', 'nep148'].some(r=> data.probableInterfaces.indexOf(r) >= 0)) {
        return CONTRACT_INTERFACE.FUNGIBLE_TOKEN;
      }
    }

    catch(error) {
      return CONTRACT_INTERFACE.UNKNOWN;
    }
  }
}