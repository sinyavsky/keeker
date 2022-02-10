import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import { formatNearAmount, formatTokenAmount } from '../utils/format.js';
import iconNear from '../../images/near.svg';

export default function accountWrap(parser, metadata, currentAccount) {
  const account = parser.getFunctionCallReceiver();
  if(account !== 'wrap.near') {
    return false;
  }

  const method = parser.getFunctionCallMethod();

  const res = {
    heading: `Call function ${method} from contract ${account}`,
    iconSrc: iconNear,
    iconAlt: 'Wrapped NEAR',
    filter: {
      section: FILTER_SECTION.WNEAR_TRANSACTIONS,
      element: FILTER_ELEMENT.WNEAR_TRANSACTIONS_OTHER,
    },    
  };
 
  if(method === "near_deposit") {
    const tokenAmount = formatNearAmount(parser.getWrapNearDepositAmount());
    res.heading = `Wrap ${tokenAmount} NEAR using wrap.near contract`;
    res.filter.element = FILTER_ELEMENT.WNEAR_TRANSACTIONS_WRAP;
  }
  else if(method === "near_withdraw") {
    const tokenAmount = formatNearAmount(parser.getWrapNearWidthdrawAmount());
    res.heading = `Unwrap ${tokenAmount} NEAR using wrap.near contract`;     
    res.filter.element = FILTER_ELEMENT.WNEAR_TRANSACTIONS_UNWRAP;
  }

  else if(method === "ft_transfer_call" || method === "ft_transfer") {
    const tokenAmount = formatTokenAmount(parser.getFtTransferAmount(), metadata.decimals);
    if(parser.getSignerId() === currentAccount) {
      res.heading = `Send ${tokenAmount} wNEAR to ${parser.getFtTransferReceiver()}`;      
      res.filter.element = FILTER_ELEMENT.WNEAR_TRANSACTIONS_SEND;
    }
    else {
      res.heading = `Receive ${tokenAmount} wNEAR from ${parser.getFtTransferReceiver()}`;
      res.filter.element = FILTER_ELEMENT.WNEAR_TRANSACTIONS_RECEIVE;
    }    
  }
  else if(method === "storage_deposit") {
    const tokenAmount = formatNearAmount(parser.getStorageDepositAmount());
    res.heading = `Deposit ${tokenAmount} NEAR into storage of ${account} contract`;
    if(parser.getStorageDepositReceiver() != currentAccount) {
      res.heading += ` for account ${parser.getStorageDepositReceiver()}`;
    }
    res.filter.section = FILTER_SECTION.NEAR_TRANSFER,
    res.filter.element = FILTER_ELEMENT.NEAR_TRANSFER_STORAGE;
  }

  else if(method === "storage_widthdraw") {// todo: widthraw near from contract storage

  }

  return res;
}