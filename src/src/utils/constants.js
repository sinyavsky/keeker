export const nearConnectionConfig = {
  networkId: 'mainnet',
  keyStore: {},
  nodeUrl: 'https://rpc.ankr.com/near', // https://rpc.mainnet.near.org
  archivalUrl: 'https://archival-rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'https://explorer.mainnet.near.org',
};


// enums

export const ACTION_KIND = { 
  FUNCTION_CALL: 'FUNCTION_CALL',
  TRANSFER: 'TRANSFER',
  ADD_KEY: 'ADD_KEY',
  DELETE_KEY: 'DELETE_KEY',
  DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
  STAKE: 'STAKE',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT'
};

export const CONTRACT_INTERFACE = {
  NON_FUNGIBLE_TOKEN: 'NON_FUNGIBLE_TOKEN',
  FUNGIBLE_TOKEN: 'FUNGIBLE_TOKEN',
  UNKNOWN: 'UNKNOWN'
};

export const FILTER_SECTION = {
  NEAR_TRANSFER: 'Near transfers',
  ACCESS_KEYS: 'Access keys',
  STAKING: 'Staking',
  CONTRACT_DEPLOY: 'Contract deploying',
};

export const FILTER_ELEMENT = {
  NEAR_TRANSFER_IN: 'In',
  NEAR_TRANSFER_OUT: 'Out',
  ACCESS_KEYS_ADD: 'Add',
  ACCESS_KEYS_DELETE: 'Delete',
  STAKING_STAKE: 'Stake',
  STAKING_UNSTAKE: 'Unstake',
  STAKING_WITHDRAW: 'Withdraw',
  CONTRACT_DEPLOY_DEPLOY: 'Deploy contract',
};