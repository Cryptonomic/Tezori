import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import TezosAmount from '../../../app/components/TezosAmount';
import Tooltip from '../../../app/components/Tooltip';

Enzyme.configure({ adapter: new Adapter() });

function setup(props = {}) {
  const provider = (
    <ThemeProvider theme={theme}>
      <TezosAmount {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<TezosAmount />', () => {
  it('Tooltip shoud be exist', () => {
    const wrapper = setup({
      amount: 100,
      showTooltip: true
    });
    expect(wrapper.find(Tooltip)).toHaveLength(1);
  });

  it('Tooltip shoud not be exist', () => {
    const wrapper = setup({
      amount: 100,
      showTooltip: false
    });
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });

  it('render ~', () => {
    const wrapper = setup({
      amount: 100,
      format: 2,
      showTooltip: false
    });
    expect(wrapper.find('Amount').text()[0]).toEqual('~');
  });
});
