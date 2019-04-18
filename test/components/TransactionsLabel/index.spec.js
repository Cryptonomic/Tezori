import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import TransactionsLabel from '../../../app/components/TransactionsLabel';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <TransactionsLabel {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<TransactionsLabel />', () => {
  it('shoud render TransactionsLabel', () => {
    const wrapper = setup({
      date: '2019-02-26T08:41:59.897Z'
    });
    expect(wrapper.find('TransactionsDate').text()).toEqual('February 26');
  });
});
