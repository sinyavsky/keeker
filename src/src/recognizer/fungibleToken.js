import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import { formatNearAmount, formatTokenAmount } from '../utils/format.js';
import contractApi from '../api/contractApi.js';
import iconNear from '../../images/near.svg';

export default async function fungibleToken(parser, currentAccount) {
  const method = parser.getFunctionCallMethod();
  const receiver = parser.getFunctionCallReceiver();
  const metadata = await contractApi.ft_metadata(receiver);
  let tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;

  const res = {
    heading: `Call function ${method} from Fungible token contract ${receiver}`,
    iconSrc: iconNear, // todo: add default icon
    iconAlt: metadata.name,
    filter: {
      section: FILTER_SECTION.FUNGIBLE_TOKENS,
      element: tokenName,
    },
  };  

  if(metadata.icon && metadata.icon.length > 0) {
    res.iconSrc = metadata.icon;
  }

  if(method === "ft_transfer_call" || method === "ft_transfer") {
    const tokenAmount = formatTokenAmount(parser.getFtTransferAmount(), metadata.decimals);
    if(parser.getSignerId() === currentAccount) {
      res.heading = `Send ${tokenAmount} ${tokenName} to ${parser.getFtTransferReceiver()}`;    
    }
    else {
      res.heading = `Receive ${tokenAmount} ${tokenName} from ${parser.getFtTransferReceiver()}`;
    }    
  }
  else if(method === "storage_deposit") {
    const tokenAmount = formatNearAmount(parser.getStorageDepositAmount());
    res.heading = `Deposit ${tokenAmount} NEAR into storage of ${tokenName} contract`;
    if(parser.getStorageDepositReceiver() != currentAccount) {
      res.heading += ` for account ${parser.getStorageDepositReceiver()}`;
    }
    res.iconSrc = iconNear;
    res.iconAlt = 'Near';
    res.filter = [
      {
        section: FILTER_SECTION.NEAR_TRANSFER,
        element: FILTER_ELEMENT.NEAR_TRANSFER_STORAGE,
      },
      {
        section: FILTER_SECTION.FUNGIBLE_TOKENS,
        element: tokenName,
      },
    ];
    
  }

  else if(method === "storage_widthdraw") {// todo: widthraw near from contract storage

  }
  
  return res;
}