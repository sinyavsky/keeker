
export default async function getSourceTransactions(account, limit) {
  const response = await fetch('https://helper.mainnet.near.org/account/' + account + '/activity?limit=' + limit);
  return await response.json();
  }
