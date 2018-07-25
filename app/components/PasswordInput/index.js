import React from 'react'
import styled from 'styled-components'
import { TextField } from 'material-ui'
import { ms } from '../../styles/helpers'

const Container = styled.div`
  position: relative;
`;

const ShowHidePwd = styled.div`
  position: absolute;
  right: 10px;
  top: 40px;
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: 12px;
  font-weight: 500;
`;

type Props = {
  label: string,
  isShowed?: boolean,
  containerStyle?: object,
  changFunc: Function,
  onShow: Function
};

const PasswordInput = (props: Props) => {
  const { label, isShowed, changFunc, onShow, containerStyle } = props;
  return (
    <Container style={containerStyle}>
      <TextField
        floatingLabelText={label}
        type={isShowed? 'text': 'password'}
        style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
        onChange={(_, newVal) => changFunc(newVal)}
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
