import { Near } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
import { nearConnectionConfig } from '../utils/constants.js';

class ContractApi {

  constructor() {
    this._near = new Near(nearConnectionConfig);

    this._cachedContracts = {};
    this._cachedMetadata = {};
  }

  _getContractFromCache(account_id) {
    return account_id in this._cachedContracts ? this._cachedContracts[account_id] : false;
  }

  _addContractToCache(account_id, data) {
    this._cachedContracts[account_id] = data;
  }

  _getMetadataFromCache(account_id) {
    return account_id in this._cachedMetadata ? this._cachedMetadata[account_id] : false;
  }

  _addMetadataToCache(account_id, data) {
    this._cachedMetadata[account_id] = data;
  }

  async getContractData(account_id) {
    const cache = this._getContractFromCache(account_id);
    if(cache !== false) {
      return cache;
    }

    try {
      const { code_base64 } = await this._near.connection.provider.query({
        account_id,
        finality: 'final',
        request_type: 'view_code',
      });
      const res = parseContract(code_base64); // very slow thing, probably will move it to server later
      this._addContractToCache(account_id, res);
      return res;
    }

    catch(error) {
      return {};
    }
  }

  async ft_metadata(account_id) {
    const cache = this._getMetadataFromCache(account_id);
    if(cache !== false) {
      return cache;
    }

    try {
      const rawResult = await this._near.connection.provider.query({
        request_type: 'call_function',
        account_id: account_id,
        method_name: 'ft_metadata',
        args_base64: "",
        finality: 'optimistic',
      });
      const res = JSON.parse(Buffer.from(rawResult.result).toString());
      this._addMetadataToCache(account_id, res);
      return res;
    }

    catch(error) {
      return {};
    }
  }

  async nft_metadata(account_id) {
    const cache = this._getMetadataFromCache(account_id);
    if(cache !== false) {
      return cache;
    }

    try {
      const rawResult = await this._near.connection.provider.query({
        request_type: 'call_function',
        account_id: account_id,
        method_name: 'nft_metadata',
        args_base64: "",
        finality: 'optimistic',
      });
      const res = JSON.parse(Buffer.from(rawResult.result).toString());
      this._addMetadataToCache(account_id, res);
      return res;
    }

    catch(error) {
      return {};
    }
  }

  async viewMethod(account_id, method_name, methodArgs) { // think of adding cache
    try {
      const rawResult = await this._near.connection.provider.query({
        request_type: 'call_function',
        account_id,
        method_name,
        args_base64: Buffer.from(JSON.stringify(methodArgs)).toString('base64'),
        finality: 'optimistic',
      });
      return JSON.parse(Buffer.from(rawResult.result).toString());
    }

    catch(error) {
      return {};
    }
  }
}

const contractApi = new ContractApi(); // should be global because of caching inside
export default contractApi;