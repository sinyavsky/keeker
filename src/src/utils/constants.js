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

export const ACTION_DIRECTION = {
  IN: 'IN',
  OUT: 'OUT'
};

export const CONTRACT_INTERFACE = {
  NON_FUNGIBLE_TOKEN: 'NON_FUNGIBLE_TOKEN',
  FUNGIBLE_TOKEN: 'FUNGIBLE_TOKEN',
  UNKNOWN: 'UNKNOWN'
};