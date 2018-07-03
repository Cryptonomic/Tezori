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