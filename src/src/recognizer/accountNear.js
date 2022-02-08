import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import iconNear from '../../images/near.svg';

export default function accountNear(parser) {
  if(parser.getFunctionCallReceiver() === 'near') {
    if(parser.getFunctionCallMethod() === 'create_account') {
      const createdAccount = parser.getNearCreatedAccount();
      return {
        heading: `Create account ${createdAccount.name} and deposit ${formatNearAmount(createdAccount.deposit)} NEAR into it`,
        iconSrc: iconNear,
        iconAlt: 'Near',
        filterSection: FILTER_SECTION.ACCOUNTS,
        filterElement: FILTER_ELEMENT.ACCOUNTS_CREATE,
      };
    }
  }
  return false;
}