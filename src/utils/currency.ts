import { BigNumber } from 'bignumber.js';
const utez = 1_000_000;
export function tezToUtez(amount: number | string): number {
    const a = typeof amount === 'string' ? parseFloat(amount) : amount;
    const b = new BigNumber(a);
    const m = b.multipliedBy(utez);

    return m.toNumber();
}