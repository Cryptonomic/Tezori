import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import Loader from '../../../app/components/Loader';

Enzyme.configure({ adapter: new Adapter() });

function setup(props = {}) {
  const provider = (
    <ThemeProvider theme={theme}>
      <Loader {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Loader />', () => {
  it('shoud be exist', () => {
    const wrapper = setup();
    expect(wrapper.find('LoaderSpinner')).toHaveLength(1);
  });
});
