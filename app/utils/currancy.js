const utez = 1000000;

export function utezToTez(amount) {
  return amount / utez;
}

export function tezToUtez(amount) {
  return amount * utez;
}

export function formatAmount(amount, decimal: number = 6) {
  return utezToTez(amount).toFixed(decimal);
}