import { ACTION_KIND, ACTION_DIRECTION } from '../utils/constants.js';
import { formatNearAmount } from "../utils/format.js";
import iconNear from '../images/near.svg';
import iconKey from '../images/key.svg';
import iconContract from '../images/contract.svg';
import iconStake from '../images/stake.svg';
import iconCreateAccount from '../images/create-account.svg';
import iconDeleteAccount from '../images/delete-account.svg';

export default function getTransactionBaseData(trx, currentAccount) {
  const res = {
    actionKind: trx.action_kind,
    hash: trx.hash,
    blockHash: trx.block_hash,
    blockTimestamp: trx.block_timestamp,
    source: trx
  };

  switch(trx.action_kind) {
    case ACTION_KIND.FUNCTION_CALL:
      res.heading = 'Loading...'; // okay, we will parse function call later
    break;
    case ACTION_KIND.TRANSFER:
      if(trx.signer_id === currentAccount) {
        const nearAmount = formatNearAmount(trx.args.deposit);
        res.heading = `Send ${nearAmount} NEAR to ${trx.receiver_id}`;
        res.actionDirection = ACTION_DIRECTION.OUT;
        res.iconSrc = iconNear;
      }
      else {// trx.receiver_id === currentAccount
        const nearAmount = formatNearAmount(trx.args.deposit);
        res.heading = `Receive ${nearAmount} NEAR from ${trx.signer_id}`;
        res.actionDirection = ACTION_DIRECTION.IN;
        res.iconSrc = iconNear;
      }
    break;
    case ACTION_KIND.ADD_KEY: // todo: check is heading relevant
      res.heading = `Add key ${trx.args.public_key} with access ${trx.args.access_key.permission.permission_kind}`;

      if(trx.args.access_key.permission.permission_details && trx.args.access_key.permission.permission_details.receiver_id) {
        res.heading += ` for ${trx.args.access_key.permission.permission_details.receiver_id}`;
      }
      res.iconSrc = iconKey;
    break;
    case ACTION_KIND.DELETE_KEY: // todo: check is heading relevant
      res.heading = `Delete key ${trx.args.public_key}`;
      res.iconSrc = iconKey;
    break;
    case ACTION_KIND.DEPLOY_CONTRACT: // todo: check is heading relevant
      res.heading = 'Deploy contract';
      res.iconSrc = iconContract;
    break;
    case ACTION_KIND.STAKE: // todo: check is heading relevant
      res.heading = 'Stake';
      res.iconSrc = iconStake;
    break;
    case ACTION_KIND.CREATE_ACCOUNT: // todo: check is heading relevant
      res.heading = `Create account ${trx.receiver_id}`;
      res.iconSrc = iconCreateAccount;
    break;
    case ACTION_KIND.DELETE_ACCOUNT: // todo: check is heading relevant
      res.heading = `Delete account ${trx.receiver_id}`;
      if(trx.args.beneficiary_id) {
        res.heading += ` and transfer remaining funds to beneficiary account: ${trx.args.beneficiary_id}`;
      }
      res.iconSrc = iconDeleteAccount;
    break;
    default: // todo: add icon and probably make a log
      res.heading = 'Unknown action';
    break;      
  }
  return res;
}