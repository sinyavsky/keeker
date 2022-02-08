import { FILTER_SECTION } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import iconBocaChica from '../../images/boca-chica.png';

export default function launchpadBocaChica(parser) {
  if(parser.getFunctionCallReceiver() === 'launchpad.bocachica_mars.near') {
    
    const res = {
      iconSrc: iconBocaChica,
      iconAlt: 'Boca Chica Launchpad',
      filterSection: FILTER_SECTION.OTHER,
      filterElement: 'Boca Chica launchpad',
    };

    const method = parser.getFunctionCallMethod();
    if(method === 'claim_refund') {
      return {
        ...res,
        heading: `Claim refund from Boca Chica launchpad sale #${parser.getBocaChicaSaleId()}`, // todo: sale name and description
      };
    }
    else if(method === 'join') {
      return {
        ...res,
        heading: `Deposit ${formatNearAmount(parser.getBocaChicaJoinDeposit())} NEAR for joining Boca Chica launchpad`,
      };
    }
  }
  return false;
}