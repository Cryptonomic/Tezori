import React, {Component} from 'react';
import { TextField } from 'material-ui';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Warning from 'material-ui/svg-icons/alert/warning';
import styled from 'styled-components';
import classnames from 'classnames';


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

const StyledInputContainer = styled.div`
  position: relative;
  height: 103px;
  .valid-button {
    position: absolute;
    right: 12px;
    top: 42px;
  }
  .valid-icon {
    fill: none !important;
    stroke-width: 2;
    stroke: #259c90;
    width: 18px !important;
    height: 18px !important;
  }
  .no-valid-icon {
    fill: #ea776c !important;
    width: 18px !important;
    height: 18px !important;    
  }
`



const validIcon = (isShow: boolean = false, isValid: boolean = false) => {
  if (!isShow) {
    return null;
  }
  if (isValid) {
    return (<CheckCircle className={classnames('valid-icon', 'valid-button')} />);
  }
  return (<Warning className={classnames('no-valid-icon', 'valid-button')} />);
}

type Props = {
  value: string,
  index: number,
  checkValidation: Function,
  onEnter: Function
};

export default class InputValidComponent extends Component<Props> {
  props: Props;
  state = { isInputVal: false,  isMatching: false, isMatched: false, errorText: ''};

  getLabel = (index) => {
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
  }

  changFunc = (val) => {
    if (!this.state.isInputVal) {
      this.setState({ isInputVal: true });
    }
    let isValid = false;

    if (val) {
      const index = this.props.value.indexOf(val);
      if (val === this.props.value) {
        this.setState({ isMatched: true, isMatching: false, errorText: '' });
        isValid = true;
      } else if (index < 0){
        this.setState({ isMatched: false, isMatching: false, errorText: "It's a typo! Please check again" });        
      } else {
        this.setState({ isMatched: false, isMatching: true, errorText: '' });        
      }

      
    } else {
      this.setState({ isMatched: false, isMatching: false, errorText: "It's a typo! Please check again" });
    }

    this.props.checkValidation(isValid);
  }
  keyHandler = (ev) => {
    if (ev.key === 'Enter') {
      this.props.onEnter();
      ev.preventDefault();
    }
  }


  render() {
    const label = this.getLabel(this.props.index);
    return (
      <StyledInputContainer>
        <TextField
          floatingLabelText={label}
          floatingLabelStyle={inputStyles.floatingLabelStyle}
          floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
          underlineStyle={inputStyles.underlineStyle}
          underlineFocusStyle={inputStyles.underlineFocusStyle}  
          errorText={this.state.errorText}
          errorStyle={{color: '#ea776c', borderColor: '#ea776c'}}
          onChange={(_, newVal) => this.changFunc(newVal)}
          onKeyPress={this.keyHandler}
        />
        {validIcon(this.state.isInputVal && !this.state.isMatching, this.state.isMatched)}
      </StyledInputContainer>
    );
  }  
}