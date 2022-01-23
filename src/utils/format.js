import { utils } from "near-api-js";

export function formatNearAmount(amount) {
  // todo: add format for small amount, like 0.0001 and so
  return utils.format.formatNearAmount(amount, 2);
}

// eslint-disable-next-line no-unused-vars
export function formatTokenAmount(balance, nomination, fracDigits) {
  // todo: add format logic
  return balance;
}