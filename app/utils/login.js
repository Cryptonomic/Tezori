
export function isLoggedIn(state) {
  const { wallet } = state;
  return wallet.get('password') && wallet.get('walletFileName') && wallet.get('walletLocation');
}

export function isSetLedger(state) {
  const { wallet } = state;
  return wallet.get('isLedger');
}