import { FILTER_SECTION } from '../utils/constants.js';
import iconRefFinance from '../../images/ref-finance.png';
import contractApi from '../api/contractApi.js';
import { formatTokenAmount, formatTokenName } from '../utils/format.js';

export default async function dexRefFinance(parser) {
  const functionCallReceiver = parser.getFunctionCallReceiver();
  if(functionCallReceiver !== 'v2.ref-finance.near') {   
    return false;
  } 
  
  const res = {
    iconSrc: iconRefFinance,
    iconAlt: 'Ref.finance',
    filter: {
      section: FILTER_SECTION.OTHER,
      element: 'Ref.finance',
    },
  };

  const method = parser.getFunctionCallMethod();  
  if(method === 'swap') {
    const actions = parser.getArgsJson().actions;
    const actionsArr = await actions.reduce(async (prev, cur) => {
      const metaIn = await contractApi.ft_metadata(cur.token_in);
      const metaOut = await contractApi.ft_metadata(cur.token_out);
      prev.push(`${formatTokenAmount(cur.amount_in, metaIn.decimals)} ${formatTokenName(metaIn.symbol, metaIn.name)} for ${formatTokenAmount(cur.min_amount_out, metaOut.decimals)} ${formatTokenName(metaOut.symbol, metaOut.name)}`);
      return prev;
    }, []);
    return {
      ...res,
      heading: `Swap ${actionsArr.join(', ')} at Ref.finance`,
    };
  }

  return {
    ...res,
    heading: `Call method ${method} from the contract ${parser.getFunctionCallReceiver()}`,
  };
}