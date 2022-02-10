import { FILTER_SECTION, FILTER_ELEMENT } from '../utils/constants.js';
import { formatNearAmount } from '../utils/format.js';
import iconNear from '../../images/near.svg';

export default function validatorNode(parser, validatorsList, currentAccount) {
  const account = parser.getFunctionCallReceiver();

  if(!validatorsList.includes(account)) {
    return false;
  }

  const res = {
    iconSrc: iconNear,
    iconAlt: 'NEAR',
  };

  const method = parser.getFunctionCallMethod();

  if (method === 'deposit_and_stake') {
    const nearAmount = formatNearAmount(parser.getValidatorDepositAndStakeAmount());
    let heading = `Deposit and stake ${nearAmount} NEAR to the validator ${account}`;
    if(parser.getSignerId() !== currentAccount) {
      heading += ` by ${parser.getSignerId()}`;
    }
    return {
      ...res,
      heading,
      filter: {
        section: FILTER_SECTION.STAKING,
        element: FILTER_ELEMENT.STAKING_STAKE,
      },
    };
  }
  else if (method === 'unstake') {
    const nearAmount = formatNearAmount(parser.getValidatorUnstakeAmount());
    return {
      ...res,
      heading: `Unstake ${nearAmount} NEAR from the validator ${account}`,
      filter: {
        section: FILTER_SECTION.STAKING,
        element: FILTER_ELEMENT.STAKING_UNSTAKE,
      },
    };
  }
  else if (method === 'withdraw_all') {
    return {
      ...res,
      heading: `Widthdraw all available NEAR from the validator ${account}`,
      filter: {
        section: FILTER_SECTION.STAKING,
        element: FILTER_ELEMENT.STAKING_WITHDRAW,
      },   
    };
  }
  else if (method === 'unstake_all') {
    return {
      ...res,
      heading: `Unstake all available NEAR from the validator ${account}`,
      filter: {
        section: FILTER_SECTION.STAKING,
        element: FILTER_ELEMENT.STAKING_UNSTAKE,
      },      
    };
  }
  return false;
}