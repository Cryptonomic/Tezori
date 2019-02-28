import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import CustomSelect from '../../../app/components/CustomSelect';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <CustomSelect {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<CustomSelect />', () => {
  it('Renders CustomSelect', () => {
    const wrapper = setup({
      label: 'Test',
      value: 'test',
      onChange: () => {}
    });
    expect(wrapper.find('LabelWrapper').text()).toEqual('Test');
  });
});
