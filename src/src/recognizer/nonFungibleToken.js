import { FILTER_SECTION } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import { getParasNftUrl } from '../utils/utils.js';
import iconNear from '../../images/near.svg';

export default function nonFungibleToken(parser, metadata) {
  const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
  const res = {
    heading: `Interraction with NFT contract ${tokenName}`,
    iconSrc: iconNear, // todo: add default icon
    iconAlt: metadata.name,
    filter: {
      section: FILTER_SECTION.NFT,
      element: tokenName,
    },
  };
  
  if(metadata.icon && metadata.icon.length > 0) {
    res.iconSrc = metadata.icon;    
  }

  if(parser.getFunctionCallReceiver() === 'near-punks.near') {
    if(parser.getFunctionCallMethod() === "master_mint") {
      const mintData = parser.getNearPunksMasterMint();
      const amount = mintData.nftAmount === 1 ? `1 NFT` : `${mintData.nftAmount} NFTs`;
      res.heading = `Mint ${amount} for ${formatNearAmount(mintData.deposit)} NEAR from contract ${tokenName}`;
    }
  }
  else if(parser.getFunctionCallReceiver() === 'x.paras.near') { // paras NFT contract
    const args = parser.getArgsJson();
    if(parser.getFunctionCallMethod() === "nft_transfer") {
      const token = args.token_id.indexOf(':') === -1  ? args.token_id : args.token_id.split(':')[0];
      const receiver = args.receiver_id;
      res.heading = `Transfer Paras NFT <a href="${getParasNftUrl(token)}" target="_blank">${args.token_id}</a> to ${receiver}`;
    }
  }
  
  return res;
}