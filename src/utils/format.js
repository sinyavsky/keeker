import { utils } from "near-api-js";

export function formatNearAmount(amount) {
  return utils.format.formatNearAmount(amount);
}

export function formatTokenAmount(balance, nomination) {
  balance = balance.toString();
  const pos = balance.length - parseInt(nomination);
  if(pos > 0) {
    return parseFloat(`${balance.slice(0, pos)}.${balance.slice(pos)}`);
  }
  return parseFloat(`${'0'.repeat(pos+1)}.${balance}`);
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