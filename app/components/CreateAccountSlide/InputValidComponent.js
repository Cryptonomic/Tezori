import React, { Component } from 'react';
import Warning from '@material-ui/icons/Warning';
import styled from 'styled-components';
import TextField from '../TextField';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon';

const StyledInputContainer = styled.div`
  position: relative;
  height: 103px;
  padding-top: 16px;
  width: 45%;
`;

const CheckIcon = styled(TezosIcon)`
  position: absolute;
  top: 42px;
  right: 5px;
`;

const WarningIcon = styled(Warning)`
  &&& {
    position: absolute;
    right: 12px;
    top: 42px;
    fill: ${({ theme: { colors } }) => colors.error1 };
    width: 18px;
    height: 18px;
  }  
`;

const validIcon = (isShow: boolean = false, isValid: boolean = false) => {
  if (!isShow) {
    return null;
  }
  if (isValid) {
    return <CheckIcon iconName="checkmark2" size={ms(0)} color="check" />;
  }
  return <WarningIcon />;
};

type Props = {
  value: string,
  index: number,
  checkValidation: () => {},
  onEnter: () => {}
};

export default class InputValidComponent extends Component<Props> {
  props: Props;
  state = {
    isInputVal: false,
    isMatching: false,
    isMatched: false,
    errorText: ''
  };

  getLabel = index => {
    switch (index) {
      case 1:
        return '1st Word';
      case 2:
        return '2nd Word';
      case 3:
        return '3rd Word';
      default:
        return `${index}th Word`;
    }
  };

  changFunc = val => {
    if (!this.state.isInputVal) {
      this.setState({ isInputVal: true });
    }
    let isValid = false;

    if (val) {
      const index = this.props.value.indexOf(val);
      if (val === this.props.value) {
        this.setState({ isMatched: true, isMatching: false, errorText: '' });
        isValid = true;
      } else if (index < 0) {
        this.setState({
          isMatched: false,
          isMatching: false,
          errorText: 'Invalid word, please check again!'
        });
      } else {
        this.setState({ isMatched: false, isMatching: true, errorText: '' });
      }
    } else {
      this.setState({
        isMatched: false,
        isMatching: false,
        errorText: "It's a typo! Please check again"
      });
    }

    this.props.checkValidation(isValid);
  };
  keyHandler = ev => {
    if (ev.key === 'Enter') {
      this.props.onEnter();
      ev.preventDefault();
    }
  };

  render() {
    const label = this.getLabel(this.props.index);
    const {errorText} = this.state;
    return (
      <StyledInputContainer>
        {/* <TextField
          floatingLabelText={label}
          floatingLabelStyle={inputStyles.floatingLabelStyle}
          floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
          underlineStyle={inputStyles.underlineStyle}
          underlineFocusStyle={inputStyles.underlineFocusStyle}
          errorText={this.state.errorText}
          errorStyle={{ color: '#ea776c', borderColor: '#ea776c' }}
          onChange={(_, newVal) => this.changFunc(newVal)}
          onKeyPress={this.keyHandler}
        /> */}
        <TextField
          label={label}
          onChange={(newVal) => this.changFunc(newVal)}
          errorText={errorText}
          onKeyPress={this.keyHandler}
        />
        {validIcon(
          this.state.isInputVal && !this.state.isMatching,
          this.state.isMatched
        )}
      </StyledInputContainer>
    );
  }
}
