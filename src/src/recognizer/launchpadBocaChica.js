import { FILTER_SECTION } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import iconBocaChica from '../../images/boca-chica.png';

export default function launchpadBocaChica(parser) {
  if(parser.getFunctionCallReceiver() !== 'launchpad.bocachica_mars.near') {   
    return false;
  } 
  
  const res = {
    iconSrc: iconBocaChica,
    iconAlt: 'Boca Chica Launchpad',
    filter: {
      section: FILTER_SECTION.OTHER,
      element: 'Boca Chica launchpad',
    },
  };

  const method = parser.getFunctionCallMethod();
  if(method === 'claim_refund') {
    return {
      ...res,
      heading: `Claim refund from Boca Chica launchpad sale #${parser.getBocaChicaSaleId()}`,
    };
  }
  else if(method === 'join') {
    return {
      ...res,
      heading: `Deposit ${formatNearAmount(parser.getBocaChicaJoinDeposit())} NEAR for joining Boca Chica launchpad`,
    };
  }
  return res;
}