import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import iconAurora from '../../images/aurora.png';

export default function transferToAurora(parser) {
  if(parser.getFunctionCallReceiver() === 'wrap.near'
  && parser.getFunctionCallMethod() === 'ft_transfer_call'
  && parser.getFtTransferReceiver() === 'aurora') {
    const nearAmount = formatNearAmount(parser.getFtTransferAmount());
    
    return {
      heading: `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${parser.getFtTransferCallMessage()}`,
      iconSrc: iconAurora,
      iconAlt: 'Aurora',
      filterSection: FILTER_SECTION.WNEAR_TRANSACTIONS,
      filterElement: FILTER_ELEMENT.WNEAR_TRANSACTIONS_TO_AURORA,
    };
  }
  return false;
}