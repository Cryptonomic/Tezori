import React from 'react'
import styled from 'styled-components'
import { TextField } from 'material-ui'
import TezosIcon from "../TezosIcon"
import { ms } from '../../styles/helpers'

const Container = styled.div`
  min-height: 93px;
`
const Content = styled.div`
  width: 100%;
  position: relative;
  .input-text-field {
    width: 100% !important;
  }

`
const PasswordStrengthSuggestions = styled.div`
  height: 3.3rem;
  width: 24rem;
`
const Suggestion = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: #92949a;
  max-width: 438px;
`
const CrackTime = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${props => (props.color)};
  span {
    font-weight: bold;
  }
`
const EyeIcon = styled(TezosIcon)`
  position: absolute;
  top: 38px;
  right: 10px;
`
const CheckIcon = styled(TezosIcon)`
  position: absolute;
  top: 42px;
  right: 40px;
`

type Props = {
  label: string,
  crackTime?: string,
  suggestion?: string,
  isShowed?: boolean,
  status?: boolean,
  score?: number,
  changFunc: Function,
  onShow: Function

};

const inputStyles = {
  underlineFocusStyle: {
    borderColor: '#2c7df7',
  },
  underlineStyle: {
    borderColor: '#d0d2d8',
  },
  errorUnderlineStyle: {
    borderColor: '#ea776c',
  },
  floatingLabelStyle: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  floatingLabelFocusStyle: {
    color: '#5571a7',
  },
};

const focusBorderColors = ['#2c7df7', '#ea776c', '#e69940', '#d3b53b', '#259c90'];

const InputValid = (props: Props) => {
  const borderColor = focusBorderColors[props.score];
  let width = '';
  if (props.score && !props.status) {
    width = `${props.score*25}%`;
  } else {
    width = `100%`;
  }

  return (
    <Container
      className={props.className}
    >
      <Content>
        <TextField
          className='input-text-field'
          floatingLabelText={props.label}
          type={props.isShowed? 'text': 'password'}
          floatingLabelStyle={inputStyles.floatingLabelStyle}
          floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
          underlineStyle={inputStyles.underlineStyle}
          underlineFocusStyle={{borderColor, width}}
          onChange={(_, newVal) => props.changFunc(newVal)}
        />
        {props.score===4 && <CheckIcon
          iconName='checkmark2'
          size={ms(0)}
          color="check"
          onClick={props.onShow}
        />}

        <EyeIcon
          iconName={props.isShowed? 'view-hide': 'view-show'}
          size={ms(2)}
          color="secondary"
          onClick={props.onShow}
        />
      </Content>
      <PasswordStrengthSuggestions>
        {!!props.crackTime && <CrackTime color={borderColor} dangerouslySetInnerHTML={{ __html: props.crackTime }} />}
        {!!props.suggestion && <Suggestion>{props.suggestion}</Suggestion>}
      </PasswordStrengthSuggestions>

    </Container>
  )
};
InputValid.defaultProps = {
  crackTime: '',
  suggestion: '',
  score: 0,
  isShowed: false,
  status: false
}

export default InputValid
