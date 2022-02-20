# Keekr

App url: https://sinyavsky.github.io/keeker/

Alternative way to browse transaction list of the account on NEAR protocol. 

## What exact problem does Keekr solve?

Default [NEAR explorer](https://explorer.near.org/) is cool, but for people that are not familiar with the blockchain / NEAR technology it may be hard to understand what's going on. I'm talking about that bunch of "Called method" headings, like:

```
Called method: 'ft_transfer_call' in contract: token.v2.ref-finance.near
Called method: 'near_deposit' in contract: wrap.near
Called method: 'deposit_and_stake' in contract: aurora.pool.near
```

Keekr will show you this information in more human friendly way:
```
Send 1073.5427346276563 REF (Ref Finance Token) to v2.ref-finance.near
Wrap 1,000 NEAR using wrap.near contract
Deposit and stake 2,548 NEAR to the validator aurora.pool.near
```

Yes, it couldn't "humanize" each function call, but it still better than nothing.

## What kind of function calls can Keekr recognize?

### Most important infrastructure actions:
- wNEAR transfers to Aurora
- Stake / Unstake / Withdraw actions on validators
- Account creating via near contract
- NEAR wrap / unwrap actions
- Fungible tokens transfers / storage deposit
- Interactions with NFT contracts
- Some method calls of another familiar contracts (such as Ref.finance)

### And off course it can handle other [action types](https://nomicon.io/RuntimeSpec/Actions) that are not related to function calls:

- CreateAccount
- DeployContract
- Transfer
- Stake
- AddKey
- DeleteKey
- DeleteAccount

## Filter transaction list

Another fancy thing: Keekr allows you to filter transaction list. I.e. you can browse only transactions related for specific token or NFT contract.

## Known issues

- Keekr uses super cool [near-contract-parser](https://github.com/encody/near-contract-parser) to recognize possible interface of the contract. This procedure takes few seconds and may freeze browser's tab. Obvious solution is to move this execution on the server side and cache it.
- Batched transaction displays as separated transactions

## Future plans

- Huge code refactoring (probably will use React)
- Deeper function call recognition for NFT contracts
- Support of the function call recognition for more popular contracts
- Server-side caching
- UI/UX improvements

## Disclaimer

Please, keep in mind that this is the first app that I've been developing by myself. I don't have much experience in building applications. So be prepared to face some strange (awful?) coding solutions inside.