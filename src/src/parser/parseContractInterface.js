import { CONTRACT_INTERFACE } from '../utils/constants.js';

export default function parseContractInterface(data) {
  try {
    if(['nep171', 'nep177', 'nep178'].some(r=> data.probableInterfaces.indexOf(r) >= 0)) {
      return CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN;
    }
    
    else if(['nep141', 'nep148'].some(r=> data.probableInterfaces.indexOf(r) >= 0)) {
      return CONTRACT_INTERFACE.FUNGIBLE_TOKEN;
    }

    else {
      return CONTRACT_INTERFACE.UNKNOWN;
    }      
  }

  catch(error) {
    return CONTRACT_INTERFACE.UNKNOWN;
  }
}
