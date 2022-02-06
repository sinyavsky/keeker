
export default async function getSourceTransactions(account, limit) {
  limit = parseInt(limit);
  if(limit < 1) {
    limit = 1;
  }
  const response = await fetch(`https://helper.mainnet.near.org/account/${account}/activity?limit=${limit}`);
  return await response.json();
}
