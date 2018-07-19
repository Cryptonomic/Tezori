import React from 'react';
import styled, { withTheme } from 'styled-components';
import LoaderSpinner from '../LoaderSpinner/';

const ShowBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5%;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100px;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

function Loader(props: Props) {
  const { theme } = props;
  return (
    <ShowBox>
      <Wrapper>
        <LoaderSpinner
          size="x2"
          bubblesStyle={{
            border:  '1px solid ' + theme.colors.primary
          }}
          styles={{
            color:  theme.colors.light
          }}
        />
      </Wrapper>
    </ShowBox>
  );
}

export default withTheme(Loader);
