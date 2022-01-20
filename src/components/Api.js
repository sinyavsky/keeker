import { Near } from 'near-api-js';
import { parseContract } from 'near-contract-parser';

export default class Api {

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

  async getAccountTransactions(account, limit) {
    const response = await fetch('https://helper.mainnet.near.org/account/' + account + '/activity?limit=' + limit);
    return await response.json();
  }

  async getContractData(account_id) { 

    try {
      const { code_base64 } = await this._near.connection.provider.query({
        account_id,
        finality: 'final',
        request_type: 'view_code',
      });
    
      return parseContract(code_base64);
    }

    catch(error) {
      return {};
    }
    
  }
}