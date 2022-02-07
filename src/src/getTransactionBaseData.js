import { ACTION_KIND, ACTION_DIRECTION } from './utils/constants.js';
import TransactionParser from './parser/TransactionParser.js';
import { formatNearAmount } from "./utils/format.js";
import iconNear from '../images/near.svg';
import iconKey from '../images/key.svg';
import iconContract from '../images/contract.svg';
import iconStake from '../images/stake.svg';
import iconCreateAccount from '../images/create-account.svg';
import iconDeleteAccount from '../images/delete-account.svg';

export default function getTransactionBaseData(trx, currentAccount, filter) {

  const parser = new TransactionParser(trx);

  const res = {
    actionKind: parser.getActionKind(),
    hash: parser.getHash(),
    blockHash: parser.getBlockHash(),
    blockTimestamp: parser.getBlockTimestamp(),
    source: trx,
    filterData: '',
  };

  switch(res.actionKind) {
    case ACTION_KIND.FUNCTION_CALL:
      res.heading = 'Loading...'; // okay, we will parse function call later
    break;
    case ACTION_KIND.TRANSFER:
      if(parser.getSignerId() === currentAccount) {
        const nearAmount = formatNearAmount(parser.getNearAmount());
        res.heading = `Send ${nearAmount} NEAR to ${parser.getNearReceiverId()}`;
        res.actionDirection = ACTION_DIRECTION.OUT;
        res.iconSrc = iconNear;
        res.filterData = filter.nearTransferOut();
      }
      else {// receiver === currentAccount
        const nearAmount = formatNearAmount(parser.getNearAmount());
        res.heading = `Receive ${nearAmount} NEAR from ${parser.getSignerId()}`;
        res.actionDirection = ACTION_DIRECTION.IN;
        res.iconSrc = iconNear;
        res.filterData = filter.nearTransferIn();
      }
    break;
    case ACTION_KIND.ADD_KEY: { // todo: check is heading relevant
      res.heading = `Add key ${parser.getAddedPublicKey()} with access ${parser.getAddedPublicKeyPermission()}`;
      const keyReceiver = parser.getAddedPublicKeyReceiver();
      if(keyReceiver) {
        res.heading += ` for ${keyReceiver}`;
      }
      res.iconSrc = iconKey;
      res.filterData = filter.accessKeysAdd();
    } break;
    case ACTION_KIND.DELETE_KEY: // todo: check is heading relevant
      res.heading = `Delete key ${parser.getDeletedPublicKey()}`;
      res.iconSrc = iconKey;
      res.filterData = filter.accessKeysDelete();
    break;
    case ACTION_KIND.DEPLOY_CONTRACT: // todo: check is heading relevant
      res.heading = 'Deploy contract';
      res.iconSrc = iconContract;
      res.filterData = filter.contractDeploy();
    break;
    case ACTION_KIND.STAKE: // todo: check is heading relevant
      res.heading = 'Stake';
      res.iconSrc = iconStake;
    break;
    case ACTION_KIND.CREATE_ACCOUNT: // todo: check is heading relevant
      res.heading = `Create account ${parser.getCreatedAccount()}`;
      res.iconSrc = iconCreateAccount;
    break;
    case ACTION_KIND.DELETE_ACCOUNT: { // todo: check is heading relevant
      res.heading = `Delete account ${parser.getDeletedAccount()}`;
      const beneficiary = parser.getDeletedAccountBeneficiary();
      if(beneficiary) {
        res.heading += ` and transfer remaining funds to beneficiary account: ${beneficiary}`;
      }
      res.iconSrc = iconDeleteAccount;
    } break;
    default: // todo: add icon and probably make a log
      res.heading = 'Unknown action';
    break;      
  }
  return res;
}