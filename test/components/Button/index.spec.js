import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import Button from '../../../app/components/Button';
import TezosIcon from '../../../app/components/TezosIcon';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <Button {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Button />', () => {
  it('shoud render TezosIcon', () => {
    const wrapper = setup({
      children: <TezosIcon size="15" color="primary" iconName="logout" />,
      buttonTheme: 'plain'
    });
    expect(wrapper.find(TezosIcon)).toHaveLength(1);
  });
});
