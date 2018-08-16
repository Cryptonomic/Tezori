import React from 'react';
import styled from 'styled-components';
import TextField from '../TextField';

const Container = styled.div`
  position: relative;
`;

const ShowHidePwd = styled.div`
  position: absolute;
  right: 10px;
  top: 26px;
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: 12px;
  font-weight: 500;
`;

type Props = {
  label: string,
  isShowed?: boolean,
  containerStyle?: object,
  password: string,
  changFunc: () => {},
  onShow: () => {}
};

const PasswordInput = (props: Props) => {
  const { label, password, isShowed, changFunc, onShow, containerStyle } = props;
  return (
    <Container style={containerStyle}>
      <TextField
        label={label}
        type={isShowed? 'text': 'password'}
        value={password}
        onChange={(newVal) => changFunc(newVal)}
      />
      <ShowHidePwd style={{cursor: 'pointer'}} onClick={onShow}>
        {isShowed? 'Hide':'Show'}
      </ShowHidePwd>
    </Container>
  )
};

PasswordInput.defaultProps = {
  isShowed: false,
  containerStyle: {}
}

export default PasswordInput
