# Keekr

Alternative way to browse transaction list of accounts on NEAR protocol. 

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

Yes, it couldn't "humanize" each function call, but it still better than nothing (below you can see the list of function calls that Keekr can handle).

Another fancy thing: Keekr allows you to filter transaction list. I.e. you can browse only transactions related for specific token or NFT contract.

## What kind of function calls can it recognize?

### Most important infrastructure actions:
- wNEAR transfers to Aurora
- Stake / Unstake / Withdraw actions on validators
- Account creating via near contract
- Fungible tokens transfers / storage deposit
- Interactions with NFT contracts

### Some method calls of another familiar contracts
- BocaChica launchpad
- Npunks (NEAR Punks) contract


## Disclaimer

Please, keep in mind that this is the first app that I've been developing by myself. I don't have much experience in building applications. So be prepared to face some strange (awful) coding solutions inside. 

If this app will be useful for the community and NEAR team will not release an update for NEAR explorer in the NEARest future (they are working on it right now as far as I know), then I will continue to maintain this project and add new functionality.