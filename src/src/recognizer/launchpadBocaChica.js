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

  const args = parser.getArgs();
  const argsJson = parser.getArgsJson();

  const method = parser.getFunctionCallMethod();
  if(method === 'claim_refund') {
    res.heading = `Claim refund from Boca Chica launchpad sale #${argsJson.sale_id}`;
  }
  else if(method === 'join') {
    res.heading = `Deposit ${formatNearAmount(args.deposit)} NEAR for joining Boca Chica launchpad`;
  }
  else if(method === 'deposit_near') {
    res.heading = `Deposit ${formatNearAmount(args.deposit)} NEAR to Boca Chica launchpad sale  #${argsJson.sale_deposit.sale_id}`;
  }
  return res;
}