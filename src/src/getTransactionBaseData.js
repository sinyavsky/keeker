import { ACTION_KIND, FILTER_SECTION, FILTER_ELEMENT } from './utils/constants.js';
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
        res.iconSrc = iconNear;
        res.filterData = filter.addItem(FILTER_SECTION.NEAR_TRANSFER, FILTER_ELEMENT.NEAR_TRANSFER_OUT);
      }
      else {// receiver === currentAccount
        const nearAmount = formatNearAmount(parser.getNearAmount());
        res.heading = `Receive ${nearAmount} NEAR from ${parser.getSignerId()}`;
        res.iconSrc = iconNear;
        res.filterData = filter.addItem(FILTER_SECTION.NEAR_TRANSFER, FILTER_ELEMENT.NEAR_TRANSFER_IN);
      }
    break;
    case ACTION_KIND.ADD_KEY: {
      res.heading = `Add key ${parser.getAddedPublicKey()} with access ${parser.getAddedPublicKeyPermission()}`;
      const keyReceiver = parser.getAddedPublicKeyReceiver();
      if(keyReceiver) {
        res.heading += ` for ${keyReceiver}`;
      }
      res.iconSrc = iconKey;
      res.filterData = filter.addItem(FILTER_SECTION.ACCESS_KEYS, FILTER_ELEMENT.ACCESS_KEYS_ADD);
    } break;
    case ACTION_KIND.DELETE_KEY:
      res.heading = `Delete key ${parser.getDeletedPublicKey()}`;
      res.iconSrc = iconKey;
      res.filterData = filter.addItem(FILTER_SECTION.ACCESS_KEYS, FILTER_ELEMENT.ACCESS_KEYS_DELETE);
    break;
    case ACTION_KIND.DEPLOY_CONTRACT:
      res.heading = `Deploy contract ${parser.getFunctionCallReceiver()}`;
      res.iconSrc = iconContract;
      res.filterData = filter.addItem(FILTER_SECTION.CONTRACT_DEPLOY, FILTER_ELEMENT.CONTRACT_DEPLOY_DEPLOY);
    break;
    case ACTION_KIND.STAKE:
      res.heading = `Stake amount changed: ${formatNearAmount(parser.getStakeUpdatedValue())}`;
      res.iconSrc = iconStake;
      res.filterData = filter.addItem(FILTER_SECTION.STAKING, FILTER_ELEMENT.STAKING_AMOUNT_CHANGE);
    break;
    case ACTION_KIND.CREATE_ACCOUNT: // todo: check is heading relevant
      res.heading = `Create account ${parser.getCreatedAccount()}`;
      res.iconSrc = iconCreateAccount;
      res.filterData = filter.addItem(FILTER_SECTION.ACCOUNTS, FILTER_ELEMENT.ACCOUNTS_CREATE);
    break;
    case ACTION_KIND.DELETE_ACCOUNT: { // todo: check is heading relevant
      res.heading = `Delete account ${parser.getDeletedAccount()}`;
      const beneficiary = parser.getDeletedAccountBeneficiary();
      if(beneficiary) {
        res.heading += ` and transfer remaining funds to beneficiary account: ${beneficiary}`;
      }
      res.iconSrc = iconDeleteAccount;
      res.filterData = filter.addItem(FILTER_SECTION.ACCOUNTS, FILTER_ELEMENT.ACCOUNTS_DELETE);
    } break;
    default: // todo: add icon and probably make a log
      res.heading = 'Unknown action';
    break;      
  }
  return res;
}