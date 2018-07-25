import React, {Fragment, Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField, Toggle } from 'material-ui';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from '../Button';
import SeedInput from './SeedInput';
import PasswordInput from '../PasswordInput';
import { importAddress } from '../../reduxContent/wallet/thunks';
import * as ADD_ADDRESS_TYPES from '../../constants/AddAddressTypes';

const MainContainer = styled.div`
  position: relative;
  height: 300px;
  padding: 0 10px;
`
const RestoreHeader = styled.div`
  font-size: 18px;
  font-weight: 300;
  display: flex;
  margin-bottom: 30px;
  color: ${({ theme: { colors } }) => colors.gray0 };

`
const RestoreTabContainer = styled.div`
  display: flex;
  border-radius: 35px;
  width: 284px;
  font-size: 12px;
  line-height: 31px;
  text-align: center;
  overflow: hidden;
  margin-left: 10px;
  font-weight: 500;
`

const RestoreTabItem = styled.div`
  background-color:  ${({ theme: { colors }, active }) => (active? colors.accent: 'rgba(148, 169, 209, 0.13)')};
  color: ${({ theme: { colors }, active }) => (active? colors.white: colors.index0) };
  flex: 1;
`

const ToggleWrapper = styled(Toggle)`
  max-width: 380px;
  margin-top: 35px;
`
const RestoreButton = styled(Button)`
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 194px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  padding: 0 !important;
`
type Props1 = {
  type: string,
  changeFunc: Function
};
const RestoreTabs = (props: Props1) => {
  const { type, changeFunc } = props;
  return (
    <RestoreTabContainer>
      <RestoreTabItem active={type==='phrase'} onClick={() => changeFunc('phrase')}>SEED PHRASE</RestoreTabItem>
      {/* <RestoreTabItem active={type==='key'} onClick={() => changeFunc('key')}>PRIVATE KEY</RestoreTabItem> */}
      <RestoreTabItem active={type==='key'}>PRIVATE KEY</RestoreTabItem>
    </RestoreTabContainer>    
  )
}



type Props = {
  importAddress?: Function
};

class RestoreBackup extends Component<Props> {
  props: Props;
  state = {
    type: 'phrase',
    seeds: [],
    inputValue: '',
    password: '',
    isPassword: false,
    isShowedPwd: false,
    key: ''
  };

  importAddress = () => {
    const { seeds, inputValue, password } = this.state;
    let str = '';
    if (seeds.length) {
      seeds.forEach((item, index)=> {
        if (index) {
          str += ` ${item}`;
        } else {
          str = item;
        }
      });
    }
    
    if (inputValue) {
      if (seeds.length) {
        str += ` ${inputValue}`;
      } else {
        str = inputValue;
      }
    }
    this.props.importAddress(ADD_ADDRESS_TYPES.RESTORE, str, '', '', '', password);
  };

  onChangeInput = (val) => {
    this.setState({inputValue: val});
  }

  onChangeItems = (items) => {
    this.setState({seeds: items, inputValue: ''});
  }

  render() {
    const { type, seeds, inputValue, password, isPassword, isShowedPwd, key } = this.state;
    let isdisabled = false;
    if (type === 'phrase') {
      isdisabled = (!seeds.length && !inputValue) ;
    } else {
      isdisabled = !key;
    }
    return(
      <MainContainer>
        <RestoreHeader>
          Restore from <RestoreTabs type={type} changeFunc={(type)=> this.setState({type})} />
        </RestoreHeader>
        {type==='phrase' && 
          <Fragment>
            <SeedInput
              selectedItem={seeds}
              inputValue={inputValue}
              onChangeInput={this.onChangeInput}
              onChangeItems={this.onChangeItems}
            />
            <ToggleWrapper
              label="This seed phrase is encrypted with a password"
              labelPosition="left"
              labelStyle={{fontSize: '16px', fontWeight: '300', color: '#4a4a4a'}}
              thumbSwitchedStyle={{backgroundColor: '#2c7df7'}}
              trackSwitchedStyle={{backgroundColor: 'rgba(44, 125, 247, 0.5)'}}
              onToggle={()=> this.setState({isPassword: !isPassword})}
            />

            {isPassword && 
              <PasswordInput
                label='Seed Pharse Password'
                isShowed={isShowedPwd}
                password={password}
                changFunc={(newpassword) => this.setState({ password: newpassword })}
                onShow={()=> this.setState({isShowedPwd: !isShowedPwd})}
              />
            }
          </Fragment>        
        }
        {type==='key' &&
          <TextField
            floatingLabelText="Enter your private key"
            type="text"
            style={{ width: '100%', padding: `0 ${ms(3)} 0 0`, marginTop: '10px' }}
            value={key}
            onChange={(_, newkey) => this.setState({ key: newkey })}
          />

        }
        <RestoreButton
          buttonTheme="primary"
          disabled={isdisabled}
          onClick={this.importAddress}
        >
          Restore
        </RestoreButton>
      </MainContainer>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      importAddress
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(RestoreBackup);
