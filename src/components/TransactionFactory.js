import { TRANSACTION_TYPE, TRANSACTION_SUB_TYPE } from '../utils/constants.js';
import Transaction from './Transaction.js';

export default class TransactionFactory {
  
  constructor(cfg) {
    this._trx = cfg.trx;
    this._account = cfg.account;
  }

  create() {
    const res = {
      type: this._trx.action_kind,
      hash: this._trx.hash,
      blockHash: this._trx.block_hash,
      blockTimestamp: this._trx.block_timestamp
    };

    switch(this._trx.action_kind) {
      case TRANSACTION_TYPE.FUNCTION_CALL:
        res.heading = 'Call function from contract';
        if(this._trx.receiver_id === 'wrap.near') {
          if(this._trx.args.method_name === 'ft_transfer_call') {
            if(this._trx.args.args_json.receiver_id === "aurora") { // aurora contract
              res.subType = TRANSACTION_SUB_TYPE.TRANSFER_TO_AURORA;
              res.partnerAurora = `0x${this._trx.args.args_json.msg}`;
              res.amount = this._trx.args.args_json.amount;
            }
          }
          
        }
        
      break;
      case TRANSACTION_TYPE.TRANSFER:
        if(this._trx.signer_id === this._account) {
          res.subType = TRANSACTION_SUB_TYPE.SEND;
          res.partner = this._trx.receiver_id;
        }
        else if(this._trx.receiver_id === this._account) {
          res.subType = TRANSACTION_SUB_TYPE.RECEIVE;
          res.partner = this._trx.signer_id;
        }
        else { // хз что
          this._heading = 'Unknown action'; // handle this        
        }        
        res.amount = this._trx.args.deposit; // количество монет
      break;
      case TRANSACTION_TYPE.ADD_KEY:
        res.heading = 'Добавление ключа';
      break;
      case TRANSACTION_TYPE.DELETE_KEY:
        res.heading = 'Удаление ключа';
      break;
      case TRANSACTION_TYPE.DEPLOY_CONTRACT:
        res.heading = 'Развертывание контракта';
      break;
      case TRANSACTION_TYPE.STAKE:
        res.heading = 'Стейкинг';
      break;
      case TRANSACTION_TYPE.CREATE_ACCOUNT:
        res.heading = 'Создание аккаунта';
      break;
      case TRANSACTION_TYPE.DELETE_ACCOUNT:
        res.heading = 'Удаление аккаунта';
      break;
      default:
        res.heading = 'Неизвестное действие';
      break;      
    } 

    return new Transaction(res);
  }
}