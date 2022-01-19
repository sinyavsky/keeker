import { Near } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
import { CONTRACT_INTERFACE } from '../utils/constants.js';

export default class ContractParser {

  constructor() {
    this._near = new Near({
      networkId: 'mainnet',
      keyStore: {},
      //nodeUrl: 'https://rpc.mainnet.near.org',
      nodeUrl: 'https://rpc.ankr.com/near',
      archivalUrl: 'https://archival-rpc.mainnet.near.org',
      walletUrl: 'https://wallet.mainnet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
    });
  }

  async getContractData(account_id) { 

    try {
      const { code_base64 } = await this._near.connection.provider.query({
        account_id,
        finality: 'final',
        request_type: 'view_code',
      });
    
      this._data = parseContract(code_base64);
    }

    catch(error) {
      this._data = {};
    }
    
  }

  getInterface() {
    try {
      if(['nep171', 'nep177', 'nep178'].some(r=> this._data.probableInterfaces.indexOf(r) >= 0)) {
        return CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN;
      }
  
      else if(['nep141', 'nep148'].some(r=> this._data.probableInterfaces.indexOf(r) >= 0)) {
        return CONTRACT_INTERFACE.FUNGIBLE_TOKEN;
      }
    }

    catch(error) {
      return CONTRACT_INTERFACE.UNKNOWN;
    }
  }

  getData() {
    return this._data;
  }
}