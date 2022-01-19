import { utils } from "near-api-js";
import { ACTION_KIND, ACTION_DIRECTION } from '../utils/constants.js';
import Transaction from './Transaction.js';

export default class TransactionFactory {
  
  constructor(cfg) {
    this._trx = cfg.trx;
    this._account = cfg.account;
  }

  _parseFunctionCall() {
    let res = `Call function ${this._trx.args.method_name} from contract ${this._trx.receiver_id}`; // default
    if(this._trx.receiver_id === 'wrap.near') {
      if(this._trx.args.method_name === 'ft_transfer_call') {
        if(this._trx.args.args_json.receiver_id === "aurora") { // aurora contract
          const nearAmount = utils.format.formatNearAmount(this._trx.args.args_json.amount, 2);
          res = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${this._trx.args.args_json.msg}`;
        }
      } 
    }

    /*else if(this._trx.args.method_name === 'ft_transfer_call') {
      res = `Wrap $ NEAR and send it to Aurora address 0x${this._trx.args.args_json.msg}`;
      //res = ft_metadata(this._trx.receiver_id);
    }*/
    return res;
  }

  _parse() {
    const res = {
      actionKind: this._trx.action_kind,
      hash: this._trx.hash,
      blockHash: this._trx.block_hash,
      blockTimestamp: this._trx.block_timestamp,
      source: this._trx
    };

    switch(this._trx.action_kind) {
      case ACTION_KIND.FUNCTION_CALL:
        res.heading = this._parseFunctionCall();      
      break;
      case ACTION_KIND.TRANSFER:
        if(this._trx.signer_id === this._account) {
          const nearAmount = utils.format.formatNearAmount(this._trx.args.deposit, 2);
          res.heading = `Send ${nearAmount} NEAR to ${this._trx.receiver_id}`;
          res.actionDirection = ACTION_DIRECTION.OUT;
        }
        else {// this._trx.receiver_id === this._account
          const nearAmount = utils.format.formatNearAmount(this._trx.args.deposit, 2);
          res.heading = `Receive ${nearAmount} NEAR from ${this._trx.signer_id}`;
          res.actionDirection = ACTION_DIRECTION.IN;
        }
      break;
      case ACTION_KIND.ADD_KEY:
        res.heading = `Add key ${this._trx.args.public_key} with access ${this._trx.args.access_key.permission.permission_kind}`;

        if(this._trx.args.access_key.permission.permission_details && this._trx.args.access_key.permission.permission_details.receiver_id) {
          res.heading += ` for ${this._trx.args.access_key.permission.permission_details.receiver_id}`;
        }        
      break;
      case ACTION_KIND.DELETE_KEY:
        res.heading = `Delete key ${this._trx.args.public_key}`;
      break;
      case ACTION_KIND.DEPLOY_CONTRACT:
        res.heading = 'Deploy contract';
      break;
      case ACTION_KIND.STAKE:
        res.heading = 'Stake';
      break;
      case ACTION_KIND.CREATE_ACCOUNT:
        res.heading = `Create account ${this._trx.receiver_id}`;
      break;
      case ACTION_KIND.DELETE_ACCOUNT:
        res.heading = `Delete account ${this._trx.receiver_id}`;
        if(this._trx.args.beneficiary_id) {
          res.heading += ` and transfer remaining funds to beneficiary account: ${this._trx.args.beneficiary_id}`;
        }
      break;
      default:
        res.heading = 'Unknown action';
      break;      
    }
    return res;
  }

  create() {
    const data = this._parse();
    return new Transaction(data);
  }
}