import { FILTER_SECTION } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import iconNear from '../../images/near.svg';

export default function nonFungibleToken(parser, metadata) {
  const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
  const res = {
    heading: `Interraction with NFT contract ${tokenName}`,
    iconSrc: iconNear, // todo: add default icon
    iconAlt: metadata.name,
    filterSection: FILTER_SECTION.NFT,
    filterElement: tokenName,
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
  return res;
}