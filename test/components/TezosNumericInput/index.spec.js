import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import TezosNumericInput from '../../../app/components/TezosNumericInput';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <TezosNumericInput {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<TezosNumericInput />', () => {
  it('shoud render TezosNumericInput', () => {
    const wrapper = setup({
      handleAmountChange: () => {},
      amount: '10000000',
      labelText: 'test',
      decimalSeparator: '.'
    });
    expect(wrapper.find('LabelWrapper').text()).toEqual('test');
  });
});
