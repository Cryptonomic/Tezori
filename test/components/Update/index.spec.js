import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import RefreshIcon from '@material-ui/icons/Refresh';
import theme from '../../../app/styles/theme';
import Update from '../../../app/components/Update';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Update {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Update />', () => {
  it('shoud render SpinningRefreshIcon', () => {
    const wrapper = setup({
      isReady: true,
      isWalletSyncing: true,
      time: new Date()
    });
    expect(wrapper.find('SpinningRefreshIcon')).toHaveLength(1);
  });

  it('shoud render RefreshIcon', () => {
    const wrapper = setup({
      isReady: false,
      isWalletSyncing: false,
      time: new Date()
    });
    expect(wrapper.find(RefreshIcon)).toHaveLength(1);
  });
});
