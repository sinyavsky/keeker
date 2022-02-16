import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import iconRefFinance from '../../images/ref-finance.png';
import contractApi from '../api/contractApi.js';
import { formatNearAmount, formatTokenAmount, formatTokenName } from '../utils/format.js';


export default async function dexRefFinanceFarming(parser) {
  const functionCallReceiver = parser.getFunctionCallReceiver();
  if(functionCallReceiver !== 'v2.ref-farming.near') {   
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

  if(method === 'storage_deposit') {
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

  else if(method === 'withdraw_seed') {
    const poolId = parseInt(argsJson.seed_id.substring(argsJson.seed_id.indexOf('@')+1));
    const poolData = await contractApi.viewMethod('v2.ref-finance.near', 'get_pool', { // todo: get rid of hard coding
      'pool_id': poolId
    });
    if(poolData === false) {
      res.heading = `Remove LP tokens from farming at Ref.finance`;
    }
    else {
      const decimals = poolData.pool_kind === 'SIMPLE_POOL' ? 24 : 18; // todo: get rid of hard coding, https://github.com/ref-finance/ref-contracts/blob/a621eda2e0e170cdf2a9644543064057020781f4/ref-exchange/src/pool.rs
      const names = [];
      await Promise.all(poolData.token_account_ids.map(async (item) => {
        const mtdt = await contractApi.ft_metadata(item);
        names.push(`${formatTokenName(mtdt.symbol, mtdt.name)}`);
      }));
      res.heading = `Remove from farming ${formatTokenAmount(argsJson.amount, decimals)} LP tokens: ${names.join(' / ')} at Ref.finance`;
    }
  }

  else if(method === 'claim_reward_by_seed') {
    const poolId = parseInt(argsJson.seed_id.substring(argsJson.seed_id.indexOf('@')+1));
    const poolData = await contractApi.viewMethod('v2.ref-finance.near', 'get_pool', { // todo: get rid of hard coding
      'pool_id': poolId
    });
    if(poolData === false) {
      res.heading = `Claim rewards from the farming pool at Ref.finance`;
    }
    else {
      const names = [];
      await Promise.all(poolData.token_account_ids.map(async (item) => {
        const mtdt = await contractApi.ft_metadata(item);
        names.push(`${formatTokenName(mtdt.symbol, mtdt.name)}`);
      }));
      res.heading = `Claim reward from the farming pool: ${names.join(' / ')} at Ref.finance`;
    }
  }

  else if(method === 'withdraw_reward') {
    const mtdt = await contractApi.ft_metadata(argsJson.token_id);
    res.heading = `Withdraw reward: ${formatTokenAmount(argsJson.amount, mtdt.decimals)} ${formatTokenName(mtdt.symbol, mtdt.name)} from farming at Ref.finance`;
    
  }
  return res;
}