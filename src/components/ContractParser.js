import {  Near } from 'near-api-js';
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

    this._cachedContracts = {};
    this._cachedMetadata = {};
    this._cachedValidators = false;
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

  async getValidatorsList() {

    if(this._cachedValidators !== false) {
      return this._cachedValidators;
    }
    try {
      const currentValidators = (await this._near.connection.provider.validators(null)).current_validators;
      this._cachedValidators = currentValidators.reduce(function(res, current) {
        res.push(current.account_id);
        return res;
      }, []);
    }

    catch(error) {
      this._cachedValidators = [];
    }
    return this._cachedValidators;
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

  getInterface(data) {
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

}