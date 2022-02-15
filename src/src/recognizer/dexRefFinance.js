import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import iconRefFinance from '../../images/ref-finance.png';
import contractApi from '../api/contractApi.js';
import { formatNearAmount, formatTokenAmount, formatTokenName } from '../utils/format.js';


export default async function dexRefFinance(parser) {
  const functionCallReceiver = parser.getFunctionCallReceiver();
  if(functionCallReceiver !== 'v2.ref-finance.near') {   
    return false;
  } 
  const method = parser.getFunctionCallMethod();

  const res = {
    iconSrc: iconRefFinance,
    iconAlt: 'Ref.finance',
    filter: {
      section: FILTER_SECTION.OTHER,
      element: 'Ref.finance',
    },
    heading: `Call method ${method} from the contract ${parser.getFunctionCallReceiver()}`,
  };
  
  const argsJson = parser.getArgsJson();
  if(method === 'swap') {
    const actions = argsJson.actions;
    const actionsArr = await actions.reduce(async (prev, cur) => {
      const metaIn = await contractApi.ft_metadata(cur.token_in);
      const metaOut = await contractApi.ft_metadata(cur.token_out);
      prev.push(`${formatTokenAmount(cur.amount_in, metaIn.decimals)} ${formatTokenName(metaIn.symbol, metaIn.name)} for ${formatTokenAmount(cur.min_amount_out, metaOut.decimals)} ${formatTokenName(metaOut.symbol, metaOut.name)}`);
      return prev;
    }, []);
    res.heading = `Swap ${actionsArr.join(', ')} at Ref.finance`;

  }

  else if(method === 'withdraw') {
    const metadata = await contractApi.ft_metadata(argsJson.token_id);
    res.heading = `Withdraw ${formatTokenAmount(argsJson.amount, metadata.decimals)} ${formatTokenName(metadata.symbol, metadata.name)} from Ref.finance`;
  }

  else if(method === 'storage_deposit') {
    res.heading = `Deposit ${formatNearAmount(parser.getStorageDepositAmount())} NEAR into storage of ${functionCallReceiver}`;

    res.filter = [
      {
        section: FILTER_SECTION.NEAR_TRANSFER,
        element: FILTER_ELEMENT.NEAR_TRANSFER_STORAGE,
      },
      {
        section: FILTER_SECTION.OTHER,
        element: 'Ref.finance',
      },
    ];
  }

  else if(method === 'remove_liquidity') {
    const poolData = await contractApi.viewMethod(functionCallReceiver, 'get_pool', {
      'pool_id': argsJson.pool_id
    });
    if(poolData === false) {
      res.heading = `Remove liquidity from the pool at Ref.finance`;
    }
    else {
      const numbers = [];
      await poolData.token_account_ids.forEach(async (item, key) => {
        const mtdt = await contractApi.ft_metadata(item);
        numbers.push(`${formatTokenAmount(argsJson.min_amounts[key], mtdt.decimals)} ${formatTokenName(mtdt.symbol, mtdt.name)}`);
      });
      res.heading = `Remove liquidity from the pool: ${numbers.join(' / ')} at Ref.finance`;
    }
  }

  else if(method === 'add_liquidity') {
    const poolData = await contractApi.viewMethod(functionCallReceiver, 'get_pool', {
      'pool_id': argsJson.pool_id
    });
    if(poolData === false) {
      res.heading = `Add liquidity to the pool at Ref.finance`;
    }
    else {
      const numbers = [];
      await poolData.token_account_ids.forEach(async (item, key) => {
        const mtdt = await contractApi.ft_metadata(item);
        numbers.push(`${formatTokenAmount(argsJson.amounts[key], mtdt.decimals)} ${formatTokenName(mtdt.symbol, mtdt.name)}`);
      });
      res.heading = `Add liquidity to the pool: ${numbers.join(' / ')} at Ref.finance`;
    }
  }

  return res;
}