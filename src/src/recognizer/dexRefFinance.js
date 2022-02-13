import { FILTER_SECTION } from '../utils/constants.js';
import iconRefFinance from '../../images/ref-finance.png';

export default function dexRefFinance(parser) {
  if(parser.getFunctionCallReceiver() !== 'v2.ref-finance.near') {   
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
    console.log(actions);
    const actionsArr = actions.reduce((prev, cur) => {
      prev.push(`${cur.amount_in} ${cur.token_in} for ${cur.min_amount_out} ${cur.token_out}`);
      return prev;
    }, []);
    console.log(actionsArr);
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