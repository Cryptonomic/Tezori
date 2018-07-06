import { createSelector } from 'reselect';
export const getWallet = state => state.wallet;

export const getWalletName = createSelector(
  getWallet,
  wallet => {
    const fileName = wallet.get('walletFileName');
    const walletName = fileName.split('.');
    return walletName[0];
  }
);

export const getWalletIsLoading = createSelector(
  getWallet,
  wallet => wallet.get('isLoading')
);

export const getTotalBalance = createSelector(
  getWallet,
  wallet => {
    const identities = wallet.get('identities').toJS();
    const balances = identities.map(identity => identity.balance);
    return balances.reduce((acc, curr) => acc + curr, 0);
  }
);

export const getIdentities = createSelector(
  getWallet,
  wallet => wallet.get('identities')
);