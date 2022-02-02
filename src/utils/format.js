import { utils } from "near-api-js";

export function formatNearAmount(amount) {
  // todo: add format for small amount, like 0.0001 and so
  return utils.format.formatNearAmount(amount, 2);
}

// eslint-disable-next-line no-unused-vars
export function formatTokenAmount(balance, nomination) {
  // todo: add format logic
  return balance;
}

export function formatDateFromNanoseconds(timestamp) {
  const date = new Date(timestamp / 1000000);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };
  return new Intl.DateTimeFormat('default', options).format(date);
}