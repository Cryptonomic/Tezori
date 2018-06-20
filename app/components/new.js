// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { goHomeAndClearState } from '../reducers/walletInitialization.duck';
import tezosLogo from '../../resources/tezosLogo.png';
import Button from './Button';

const Logo = styled.img`
  height: 50px;
  width: 50px;
  cursor: pointer;
  margin-left: -10px;
`

type Props = {
  goHomeAndClearState: Function
};

class TezosLogo extends Component<Props> {
  render() {
    return (
    <Button
      onClick={ goHomeAndClearState }
      children={ <Logo src={tezosLogo} className={styles.logo} /> }
    />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ goHomeAndClearState }, dispatch);

export default connect(null, mapDispatchToProps)(TezosLogo);
