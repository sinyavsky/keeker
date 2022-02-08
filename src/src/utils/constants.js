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
  ACCOUNTS: 'Accounts',
  CONTRACT_DEPLOY: 'Contract deploying',
  WNEAR_TRANSACTIONS: 'wNEAR transactions',
  FUNGIBLE_TOKENS: 'Fungible tokens',
  NFT: 'NFTs',
  OTHER: 'Other',
};

export const FILTER_ELEMENT = {
  NEAR_TRANSFER_IN: 'Receive',
  NEAR_TRANSFER_OUT: 'Send',
  NEAR_TRANSFER_STORAGE: 'Storage deposit',
  ACCESS_KEYS_ADD: 'Add',
  ACCESS_KEYS_DELETE: 'Delete',
  STAKING_STAKE: 'Stake',
  STAKING_UNSTAKE: 'Unstake',
  STAKING_WITHDRAW: 'Withdraw',
  CONTRACT_DEPLOY_DEPLOY: 'Deploy contract',
  ACCOUNTS_CREATE: 'Create',
  ACCOUNTS_DELETE: 'Delete',
  WNEAR_TRANSACTIONS_WRAP: 'Wrap NEAR',
  WNEAR_TRANSACTIONS_UNWRAP: 'Unwrap NEAR',
  WNEAR_TRANSACTIONS_TO_AURORA: 'Transfers to Aurora',
  WNEAR_TRANSACTIONS_RECEIVE: 'Receive',
  WNEAR_TRANSACTIONS_SEND: 'Send',
  WNEAR_TRANSACTIONS_OTHER: 'Other',
  OTHER_FUNCTION_CALL: 'Unrecognized function calls'
};